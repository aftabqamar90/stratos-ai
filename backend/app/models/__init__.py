from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)

    tasks = relationship("TrainingTask", back_populates="project")


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
