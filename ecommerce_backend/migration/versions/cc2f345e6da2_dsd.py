"""dsd

Revision ID: cc2f345e6da2
Revises: bdd4c7f9d5af
Create Date: 2026-03-15 22:52:04.765379

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cc2f345e6da2'
down_revision: Union[str, Sequence[str], None] = 'bdd4c7f9d5af'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
