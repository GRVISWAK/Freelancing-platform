import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ProposalsDialog from "./ProposalsDialog";
import "./ClientProjectCard.css";

const ClientProjectCard = ({ project }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <div className="main">
      <div className="project-card">
        <h3>{project.title}</h3>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Budget:</strong> {project.currency} {project.min_budget} - {project.max_budget}</p>
        <p><strong>Category:</strong> {project.category}</p>
        <p><strong>Deadline:</strong> {project.deadline}</p>
        <p><strong>Status:</strong> {project.status}</p>
        {project.client_wallet && (
          <p><strong>Client Wallet:</strong> {project.client_wallet}</p>
        )}
        {project.freelancer_wallet && (
          <p><strong>Freelancer Wallet:</strong> {project.freelancer_wallet}</p>
        )}
        <div className="card-buttons">
          <Link to={`/editproject/${project.id}`}>
            <Button variant="contained" color="primary">Edit</Button>
          </Link>
          <Button variant="contained" color="secondary" onClick={handleOpenDialog}>Proposals</Button>
        </div>
      </div>
      {/* Proposals Dialog */}
      <ProposalsDialog open={dialogOpen} onClose={handleCloseDialog} projectId={project.id} />
    </div>
  );
};

export default ClientProjectCard;
