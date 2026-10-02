package com.example.Recuriment.job.repository;

import com.example.Recuriment.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job,Long> {
    Optional<Job>findByRecruiterIdAndId(Long recruiterId,Long id);
    List<Job> findByRecruiterId(Long recruiterId);
}
