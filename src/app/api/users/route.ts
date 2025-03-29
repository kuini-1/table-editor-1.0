import { createClient as createServiceClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const { email, password, full_name, owner_id } = await request.json();

    console.log('Attempting to create user with email:', email);

    // Check if a user exists in the profiles table
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('email', email)
      .single();

    console.log('Profile check results:', { existingProfile, profileCheckError });

    if (profileCheckError && profileCheckError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.log('Profile check error:', profileCheckError);
      return NextResponse.json({ error: profileCheckError.message }, { status: 400 });
    }

    if (existingProfile) {
      console.log('Found existing profile:', existingProfile);
      return NextResponse.json(
        { error: "A user with this email address has already been registered (found in profiles)" },
        { status: 400 }
      );
    }

    // Check if user exists in Auth system
    const { data: existingUsers, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();
    
    console.log('Auth users check results:', { 
      userCount: existingUsers?.users?.length,
      error: listUsersError 
    });

    if (listUsersError) {
      console.log('List users error:', listUsersError);
      return NextResponse.json({ error: listUsersError.message }, { status: 400 });
    }

    const existingUser = existingUsers.users.find(user => user.email === email);
    if (existingUser) {
      console.log('Found orphaned auth user, attempting to delete:', existingUser.id);
      // Delete the orphaned auth user since it has no profile
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.log('Failed to delete orphaned auth user:', deleteError);
        return NextResponse.json(
          { error: "Failed to clean up existing user record. Please try again." },
          { status: 400 }
        );
      }
      console.log('Successfully deleted orphaned auth user');
    }

    console.log('Proceeding with user creation');

    // Create user with admin client
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      console.log('Create user error:', createUserError);
      return NextResponse.json({ error: createUserError.message }, { status: 400 });
    }

    if (!authData.user) {
      console.log('No user data returned from creation');
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    console.log('User created in auth system:', authData.user.id);

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role: 'sub_owner',
      });

    if (profileError) {
      console.log('Profile creation error:', profileError);
      // Cleanup: delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    console.log('Profile created successfully');

    // Create sub_owner record
    const { data: subOwnerData, error: subOwnerError } = await supabaseAdmin
      .from('sub_owners')
      .insert({
        profile_id: authData.user.id,
        owner_id,
      })
      .select()
      .single();

    if (subOwnerError) {
      console.log('Sub-owner creation error:', subOwnerError);
      // Cleanup: delete the auth user and profile if sub_owner creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: subOwnerError.message }, { status: 400 });
    }

    console.log('Sub-owner record created:', subOwnerData);

    // Get all tables owned by the owner
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('tables')
      .select('id')
      .eq('owner_id', owner_id);

    if (tablesError) {
      console.log('Tables fetch error:', tablesError);
      return NextResponse.json({ error: tablesError.message }, { status: 400 });
    }

    console.log('Found tables:', tables?.length || 0);

    // Create default permissions (all false) for each table
    if (tables && tables.length > 0) {
      const defaultPermissions = tables.map(table => ({
        table_id: table.id,
        sub_owner_id: subOwnerData.id,
        can_get: false,
        can_put: false,
        can_post: false,
        can_delete: false
      }));

      const { error: permissionsError } = await supabaseAdmin
        .from('sub_owner_permissions')
        .insert(defaultPermissions);

      if (permissionsError) {
        console.log('Permissions creation error:', permissionsError);
        return NextResponse.json({ error: permissionsError.message }, { status: 400 });
      }
      console.log('Created permissions for', tables.length, 'tables');
    }

    console.log('User creation completed successfully');
    return NextResponse.json({ success: true, user: authData.user });
  } catch (error: object | unknown) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 