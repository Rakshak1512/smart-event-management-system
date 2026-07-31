import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
url = os.getenv('DATABASE_URL')
print('DATABASE_URL=', url)
engine = create_engine(url, pool_pre_ping=True)
with engine.connect() as conn:
    result = conn.execute(text('SELECT 1'))
    print('SELECT 1 ->', result.scalar())
