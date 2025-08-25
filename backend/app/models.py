from . import db
from datetime import datetime
import json
from sqlalchemy.dialects.postgresql import JSON

# Core Models for 5-Dimensional Coverage Framework

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Dimension weights (business priority)
    functional_weight = db.Column(db.Float, default=0.25)
    data_weight = db.Column(db.Float, default=0.20)
    journey_weight = db.Column(db.Float, default=0.25)
    risk_weight = db.Column(db.Float, default=0.20)
    environmental_weight = db.Column(db.Float, default=0.10)
    
    # Relationships
    features = db.relationship('Feature', backref='project', lazy=True, cascade='all, delete-orphan')
    test_cases = db.relationship('TestCase', backref='project', lazy=True, cascade='all, delete-orphan')
    user_journeys = db.relationship('UserJourney', backref='project', lazy=True, cascade='all, delete-orphan')
    coverage_reports = db.relationship('CoverageReport', backref='project', lazy=True, cascade='all, delete-orphan')

class Feature(db.Model):
    __tablename__ = 'features'
    
    id = db.Column(db.Integer, primary_key=True)
    feature_id = db.Column(db.String(50), nullable=False)  # External feature ID
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.String(16), nullable=False)  # high/medium/low
    complexity = db.Column(db.String(16), nullable=False)  # high/medium/low
    business_impact = db.Column(db.String(16), nullable=False)  # critical/high/medium/low
    risk_score = db.Column(db.Integer, default=1)  # 1-5 scale
    status = db.Column(db.String(16), default='uncovered')  # covered/partial/uncovered
    
    # Coverage tracking
    total_test_cases = db.Column(db.Integer, default=0)
    passed_test_cases = db.Column(db.Integer, default=0)
    failed_test_cases = db.Column(db.Integer, default=0)
    
    # Metadata
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    test_cases = db.relationship('TestCase', backref='feature', lazy=True)
    requirements = db.relationship('Requirement', backref='feature', lazy=True)
    
    def get_coverage_percentage(self):
        if self.total_test_cases == 0:
            return 0
        return round((self.passed_test_cases / self.total_test_cases) * 100, 2)
    
    def get_risk_weight(self):
        """Calculate risk weight based on business impact and complexity"""
        impact_weights = {'critical': 5, 'high': 4, 'medium': 3, 'low': 2}
        complexity_weights = {'high': 3, 'medium': 2, 'low': 1}
        
        impact_score = impact_weights.get(self.business_impact, 2)
        complexity_score = complexity_weights.get(self.complexity, 1)
        
        return min(impact_score + complexity_score, 5)

class TestCase(db.Model):
    __tablename__ = 'test_cases'
    
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.String(50), nullable=False)  # External test ID
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50))  # functional/integration/unit/e2e
    status = db.Column(db.String(16), default='not_executed')  # passed/failed/blocked/not_executed
    priority = db.Column(db.String(16), default='medium')
    
    # Test execution data
    execution_time = db.Column(db.Float)  # in seconds
    last_executed = db.Column(db.DateTime)
    execution_count = db.Column(db.Integer, default=0)
    
    # Relationships
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    feature_id = db.Column(db.Integer, db.ForeignKey('features.id'))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Requirement(db.Model):
    __tablename__ = 'requirements'
    
    id = db.Column(db.Integer, primary_key=True)
    requirement_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    acceptance_criteria = db.Column(JSON)  # List of criteria
    
    # Traceability
    feature_id = db.Column(db.Integer, db.ForeignKey('features.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    # Coverage status
    coverage_status = db.Column(db.String(16), default='not_covered')  # covered/partial/not_covered
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DataCoverageScenario(db.Model):
    __tablename__ = 'data_coverage_scenarios'
    
    id = db.Column(db.Integer, primary_key=True)
    parameter_name = db.Column(db.String(255), nullable=False)
    parameter_type = db.Column(db.String(50))  # string/integer/float/boolean/object
    
    # Coverage counts
    boundary_tests = db.Column(db.Integer, default=0)
    equivalence_tests = db.Column(db.Integer, default=0)
    error_tests = db.Column(db.Integer, default=0)
    total_scenarios = db.Column(db.Integer, default=0)
    
    # Test data examples
    valid_examples = db.Column(JSON)  # List of valid test data
    invalid_examples = db.Column(JSON)  # List of invalid test data
    boundary_examples = db.Column(JSON)  # List of boundary test data
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    feature_id = db.Column(db.Integer, db.ForeignKey('features.id'))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_coverage_percentage(self):
        if self.total_scenarios == 0:
            return 0
        covered = self.boundary_tests + self.equivalence_tests + self.error_tests
        return round((covered / self.total_scenarios) * 100, 2)

class UserJourney(db.Model):
    __tablename__ = 'user_journeys'
    
    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Journey details
    steps = db.Column(JSON)  # List of step descriptions
    business_impact = db.Column(db.String(16), nullable=False)  # critical/high/medium/low
    user_type = db.Column(db.String(100))  # admin/customer/guest etc.
    
    # Testing status
    test_status = db.Column(db.String(16), default='not_tested')  # passed/failed/not_tested
    automation_status = db.Column(db.String(16), default='manual')  # automated/manual/hybrid
    
    # Execution metrics
    execution_frequency = db.Column(db.String(16))  # daily/weekly/monthly/rarely
    average_execution_time = db.Column(db.Float)  # in minutes
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Environment(db.Model):
    __tablename__ = 'environments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50))  # browser/os/device/network
    version = db.Column(db.String(50))
    
    # Environment details
    platform = db.Column(db.String(50))  # windows/mac/linux/ios/android
    configuration = db.Column(JSON)  # Additional config details
    
    # Testing status
    is_required = db.Column(db.Boolean, default=True)
    is_tested = db.Column(db.Boolean, default=False)
    test_results = db.Column(JSON)  # Test execution results
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CoverageReport(db.Model):
    __tablename__ = 'coverage_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    report_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 5-Dimensional Coverage Scores
    functional_coverage = db.Column(db.Float, default=0.0)  # CF
    data_coverage = db.Column(db.Float, default=0.0)  # CD
    journey_coverage = db.Column(db.Float, default=0.0)  # CJ
    risk_coverage = db.Column(db.Float, default=0.0)  # CR
    environmental_coverage = db.Column(db.Float, default=0.0)  # CE
    
    # Calculated total score
    total_coverage_score = db.Column(db.Float, default=0.0)
    risk_adjusted_score = db.Column(db.Float, default=0.0)
    
    # Gap analysis
    critical_gaps = db.Column(db.Integer, default=0)
    high_priority_gaps = db.Column(db.Integer, default=0)
    medium_priority_gaps = db.Column(db.Integer, default=0)
    
    # Detailed metrics
    metrics_json = db.Column(JSON)  # Detailed breakdown
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RecommendationEngine(db.Model):
    __tablename__ = 'recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    recommendation_type = db.Column(db.String(50))  # feature_gap/boundary_gap/integration_gap/journey_gap
    priority = db.Column(db.Integer)  # 1-5 (1 is highest)
    
    # Recommendation details
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    impact_score = db.Column(db.Float)
    effort_estimate = db.Column(db.String(50))  # hours/days/weeks
    
    # Business justification
    business_impact = db.Column(db.Text)
    risk_mitigation = db.Column(db.Text)
    roi_estimate = db.Column(db.Float)
    
    # Status tracking
    status = db.Column(db.String(16), default='open')  # open/in_progress/completed/rejected
    assigned_to = db.Column(db.String(100))
    
    # References
    related_features = db.Column(JSON)  # List of feature IDs
    related_journeys = db.Column(JSON)  # List of journey IDs
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Integration Models for External Tools

class ExternalIntegration(db.Model):
    __tablename__ = 'external_integrations'
    
    id = db.Column(db.Integer, primary_key=True)
    integration_type = db.Column(db.String(50))  # jira/testrail/jenkins/github
    name = db.Column(db.String(100), nullable=False)
    
    # Connection details
    endpoint_url = db.Column(db.String(255))
    api_key = db.Column(db.String(255))  # Should be encrypted
    username = db.Column(db.String(100))
    
    # Configuration
    config_json = db.Column(JSON)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    last_sync = db.Column(db.DateTime)
    sync_status = db.Column(db.String(16), default='pending')  # success/failed/pending
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)  # create/update/delete/calculate
    entity_type = db.Column(db.String(50))  # feature/test_case/journey/report
    entity_id = db.Column(db.Integer)
    
    # Change details
    old_values = db.Column(JSON)
    new_values = db.Column(JSON)
    
    # User context
    user_id = db.Column(db.String(100))
    user_ip = db.Column(db.String(45))
    user_agent = db.Column(db.String(255))
    
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)