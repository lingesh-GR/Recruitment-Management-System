package com.example.Recuriment.recruiter.repository;

import com.example.Recuriment.recruiter.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter,Long> {
}
