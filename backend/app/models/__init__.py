from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)

    tasks = relationship("TrainingTask", back_populates="project")
    trainings = relationship("ProjectTraining", back_populates="project")


class ProjectTraining(Base):
    __tablename__ = "project_trainings"
    __table_args__ = (UniqueConstraint("project_id", "name", name="uq_project_trainings_project_id_name"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)

    project = relationship("Project", back_populates="trainings")
    results = relationship("ProjectTrainingResult", back_populates="project_training")


class ProjectTrainingResult(Base):
    __tablename__ = "project_training_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_training_id = Column(Integer, ForeignKey("project_trainings.id"), nullable=False)
    training_data = Column(Text, nullable=True)
    training_dspy_result = Column(Text, nullable=True)
    training_gepa_result = Column(Text, nullable=True)
    start_date_time = Column(DateTime, nullable=True)
    end_date_time = Column(DateTime, nullable=True)

    project_training = relationship("ProjectTraining", back_populates="results")


class TrainingTask(Base):
    __tablename__ = "training_tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    task_name = Column(String(255), nullable=False)

    project = relationship("Project", back_populates="tasks")
    results = relationship("TrainingResult", back_populates="task")


class TrainingResult(Base):
    __tablename__ = "training_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("training_tasks.id"), nullable=False)
    status = Column(String(32), nullable=False)
    end_time = Column(DateTime, nullable=True)
    signature = Column(Text, nullable=True)
    optimized_state = Column(JSON, nullable=True)

    task = relationship("TrainingTask", back_populates="results")
