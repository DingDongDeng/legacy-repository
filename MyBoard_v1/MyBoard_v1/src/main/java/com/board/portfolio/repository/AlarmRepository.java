package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepository extends JpaRepository<Alarm,String>,AlarmRepositoryCustom {
}
