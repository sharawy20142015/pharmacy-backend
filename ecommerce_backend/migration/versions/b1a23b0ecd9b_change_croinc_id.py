"""change croinc id 

Revision ID: b1a23b0ecd9b
Revises: a383e351bfd1
Create Date: 2026-03-31 (التاريخ بتاعك هنا مش هيفرق)

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1a23b0ecd9b'
down_revision: Union[str, Sequence[str], None] = 'a383e351bfd1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. تعديل الـ customer_id ليكون بيقبل NULL
    op.alter_column('Orders', 'customer_id',
               existing_type=sa.INTEGER(),
               nullable=True)


def downgrade() -> None:
    # 1. إرجاع الـ customer_id ليكون NOT NULL (زي ما كان)
    op.alter_column('Orders', 'customer_id',
               existing_type=sa.INTEGER(),
               nullable=False)