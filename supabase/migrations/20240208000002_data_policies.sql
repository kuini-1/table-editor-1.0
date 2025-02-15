-- Policies for exp_data
create policy "Users can read exp data with permission"
    on public.exp_data for select
    using (public.check_table_permission(table_id, 'select'));

create policy "Users can update exp data with permission"
    on public.exp_data for update
    using (public.check_table_permission(table_id, 'update'));

create policy "Users can insert exp data with permission"
    on public.exp_data for insert
    with check (public.check_table_permission(table_id, 'insert'));

create policy "Users can delete exp data with permission"
    on public.exp_data for delete
    using (public.check_table_permission(table_id, 'delete'));

-- Policies for merchant_data
create policy "Users can read merchant data with permission"
    on public.merchant_data for select
    using (public.check_table_permission(table_id, 'select'));

create policy "Users can update merchant data with permission"
    on public.merchant_data for update
    using (public.check_table_permission(table_id, 'update'));

create policy "Users can insert merchant data with permission"
    on public.merchant_data for insert
    with check (public.check_table_permission(table_id, 'insert'));

create policy "Users can delete merchant data with permission"
    on public.merchant_data for delete
    using (public.check_table_permission(table_id, 'delete'));

-- Policies for item_data
create policy "Users can read item data with permission"
    on public.item_data for select
    using (public.check_table_permission(table_id, 'select'));

create policy "Users can update item data with permission"
    on public.item_data for update
    using (public.check_table_permission(table_id, 'update'));

create policy "Users can insert item data with permission"
    on public.item_data for insert
    with check (public.check_table_permission(table_id, 'insert'));

create policy "Users can delete item data with permission"
    on public.item_data for delete
    using (public.check_table_permission(table_id, 'delete'));

-- Policies for activity_logs
create policy "Users can read activity logs for their tables"
    on public.activity_logs for select
    using (
        table_id in (
            select t.id from public.tables t
            where t.owner_id in (
                select o.id from public.owners o
                where o.profile_id = auth.uid()
            )
        )
        or
        table_id in (
            select p.table_id from public.sub_owner_permissions p
            join public.sub_owners so on p.sub_owner_id = so.id
            where so.profile_id = auth.uid()
            and p.can_get = true
        )
    );

-- Function to log activity
create or replace function public.log_activity(
    p_table_id uuid,
    p_action text,
    p_details text
)
returns void
language plpgsql
security definer
as $$
begin
    insert into public.activity_logs (table_id, user_id, action, details)
    values (p_table_id, auth.uid(), p_action, p_details);
end;
$$;

-- Trigger functions for logging
create or replace function public.handle_data_change()
returns trigger
language plpgsql
security definer
as $$
begin
    if TG_OP = 'INSERT' then
        perform public.log_activity(NEW.table_id, 'POST', format('Created new record with ID: %s', NEW.id));
    elsif TG_OP = 'UPDATE' then
        perform public.log_activity(NEW.table_id, 'PUT', format('Updated record with ID: %s', NEW.id));
    elsif TG_OP = 'DELETE' then
        perform public.log_activity(OLD.table_id, 'DELETE', format('Deleted record with ID: %s', OLD.id));
    end if;
    return coalesce(NEW, OLD);
end;
$$;

-- Create triggers for logging
create trigger exp_data_audit
    after insert or update or delete on public.exp_data
    for each row execute function public.handle_data_change();

create trigger merchant_data_audit
    after insert or update or delete on public.merchant_data
    for each row execute function public.handle_data_change();

create trigger item_data_audit
    after insert or update or delete on public.item_data
    for each row execute function public.handle_data_change(); 