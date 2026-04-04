"""change croinc id 

Revision ID: a383e351bfd1
Revises: e0582615c6ba
Create Date: 2026-03-31 20:55:44.154055

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = 'a383e351bfd1'
down_revision: Union[str, Sequence[str], None] = 'e0582615c6ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. حذف القيد القديم اللي عامل مشكلة مع الـ NULL
    op.drop_constraint('UQ__customer__2E7E58B980E83E16', 'customers', type_='unique')
    
    # 2. إنشاء الـ Index الجديد المفلتر للعملاء
    op.create_index(
        'ix_unique_chronic_vip_id', 
        'customers', 
        ['chronic_vip_id'], 
        unique=True, 
        mssql_where=text("chronic_vip_id IS NOT NULL")
    )


def downgrade() -> None:
    # 1. حذف الـ Index الجديد
    op.drop_index('ix_unique_chronic_vip_id', table_name='customers')
    
    # 2. إرجاع القيد القديم
    op.create_unique_constraint('UQ__customer__2E7E58B980E83E16', 'customers', ['chronic_vip_id'])