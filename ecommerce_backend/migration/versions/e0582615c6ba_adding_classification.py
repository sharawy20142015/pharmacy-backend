"""adding classification

Revision ID: e0582615c6ba
Revises: cc2f345e6da2
Create Date: 2026-03-27 15:58:20.451403
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e0582615c6ba'
down_revision: Union[str, Sequence[str], None] = 'cc2f345e6da2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    
    # ✅ إضافة العمود الجديد فقط
    op.add_column(
        'Product',
        sa.Column('classification', sa.String(length=50), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    
    # ✅ حذف العمود في حالة الرجوع
    op.drop_column('Product', 'classification')