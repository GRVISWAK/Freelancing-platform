package com.freelancex.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.freelancex.model.Project;


@Repository
public interface ProjectRepo extends JpaRepository<Project,Integer> {
    List<Project> findByClientId(int clientId);
    @Query(value = "SELECT p FROM Project p WHERE p.status='open'")
    public List<Project> openProjects();
}
