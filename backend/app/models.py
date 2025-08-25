from . import db

class Feature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    priority = db.Column(db.String(16))
    risk_score = db.Column(db.Integer)
    complexity_score = db.Column(db.Integer)
    status = db.Column(db.String(16))  # covered/partial/uncovered
    # Add more fields as needed