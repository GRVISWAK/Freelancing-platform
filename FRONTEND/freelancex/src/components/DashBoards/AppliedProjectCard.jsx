import React from "react";
import "./AppliedProjectCard.css";

const AppliedProjectCard = ({ project }) => {
  if (!project) {
    return null; // Don't render anything for null/undefined projects
}
  return (
    <div className="applied-project-card">
      <h4>{project.title}</h4>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Budget:</strong> {project.min_budget} - {project.max_budget} {project.currency}</p>
      <p><strong>Category:</strong> {project.category}</p>
      <p><strong>Deadline:</strong> {project.deadline}</p>
      <p><strong>Required Skills:</strong> {project.skills_required}</p>
      <p><strong>Status:</strong> {project.status === "accepted" ? "Accepted" : "Pending"}</p>
    </div>
  );
};

export default AppliedProjectCard;
