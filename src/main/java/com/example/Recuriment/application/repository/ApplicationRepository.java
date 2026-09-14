package com.example.Recuriment.application.repository;

import com.example.Recuriment.application.entity.Application;
import com.example.Recuriment.candidate.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    Optional<Application>findByCandidateIdAndJobId(Long candidateId,Long jobId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByCandidateId(Long candidateId);
}
