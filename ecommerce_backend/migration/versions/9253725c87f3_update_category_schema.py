"""update category schema

Revision ID: 9253725c87f3
Revises: b1a23b0ecd9b
Create Date: 2026-04-05 21:36:27.931494

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9253725c87f3'
down_revision: Union[str, Sequence[str], None] = 'b1a23b0ecd9b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # سيبنا تعديل الخصومات بس، ومسحنا أي حاجة تخص short_item_no عشان يفضل زي ما هو
    op.alter_column('Product', 'discount_value',
               existing_type=sa.NUMERIC(precision=18, scale=2),
               nullable=False)
    op.alter_column('Product', 'discount_percentage',
               existing_type=sa.NUMERIC(precision=5, scale=2),
               nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('Product', 'discount_percentage',
               existing_type=sa.NUMERIC(precision=5, scale=2),
               nullable=True)
    op.alter_column('Product', 'discount_value',
               existing_type=sa.NUMERIC(precision=18, scale=2),
               nullable=True)