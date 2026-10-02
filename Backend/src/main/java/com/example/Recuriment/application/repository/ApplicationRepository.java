package com.example.Recuriment.application.repository;

import com.example.Recuriment.application.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    Optional<Application>findByCandidateIdAndJobId(Long candidateId,Long jobId);
    Optional<Application>findByIdAndCandidateId(Long id,Long candidateId);
    Optional<Application>findByIdAndJobRecruiterId(Long id,Long recruiterId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByJobRecruiterId(Long recruiterId);
    List<Application>findByJobIdAndJobRecruiterId(Long jobId,Long recruiterId);
    Optional<Application> findByCandidateIdAndJobRecruiterId(Long candidateId,Long recruiterId);

}
