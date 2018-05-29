"""Add new column to user_infos table

Revision ID: 07d4736f25e9
Revises: 
Create Date: 2018-01-17 16:32:06.474647

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07d4736f25e9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user_infos', sa.Column('IsAdmin', sa.Boolean))


def downgrade():
    pass
