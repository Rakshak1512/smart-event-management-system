from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    print('connected')
    print(conn.execute(text("SELECT current_database(), current_user")).fetchall())
    print('users_table', conn.execute(text("SELECT to_regclass('public.users')")).scalar())
    print('events_table', conn.execute(text("SELECT to_regclass('public.events')")).scalar())
    print('all_tables', conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")).fetchall())
