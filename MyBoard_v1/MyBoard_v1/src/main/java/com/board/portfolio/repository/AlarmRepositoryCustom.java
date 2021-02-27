package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Alarm;

import java.util.List;

public interface AlarmRepositoryCustom {
    List<Alarm> findAllByTargetAccountOrderByRecieveDateDesc(Account account);
}
