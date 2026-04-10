"""update category schema

Revision ID: c9a591aec920
Revises: 9253725c87f3
Create Date: 2026-04-05 22:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c9a591aec920'
down_revision: Union[str, Sequence[str], None] = '9253725c87f3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. إضافة عمود order_number لجدول product_requests
    op.add_column('product_requests', sa.Column('order_number', sa.String(length=20), nullable=True))
    op.create_unique_constraint('uq_product_requests_order_number', 'product_requests', ['order_number'])

    # 2. تعديل طول عمود name في جدول product_requests
    op.alter_column('product_requests', 'name',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=255),
               existing_nullable=False)

    # 3. تعديل نوع عمود address ليكون Text (NVARCHAR(MAX)) في جدول product_requests
    op.alter_column('product_requests', 'address',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.Text(),
               existing_nullable=False)

    # 4. تعديل طول عمود status في جدول product_requests
    op.alter_column('product_requests', 'status',
               existing_type=sa.VARCHAR(length=10),
               type_=sa.String(length=50),
               existing_nullable=True)

def downgrade() -> None:
    # أوامر التراجع
    op.drop_constraint('uq_product_requests_order_number', 'product_requests', type_='unique')
    op.drop_column('product_requests', 'order_number')
    op.alter_column('product_requests', 'status', type_=sa.VARCHAR(length=10))
    op.alter_column('product_requests', 'address', type_=sa.VARCHAR(length=255))
    op.alter_column('product_requests', 'name', type_=sa.VARCHAR(length=100))