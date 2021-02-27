package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Alarm;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.board.portfolio.domain.entity.QAlarm.alarm;

@RequiredArgsConstructor
public class AlarmRepositoryCustomImpl implements AlarmRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Alarm> findAllByTargetAccountOrderByRecieveDateDesc(Account account) {
        return queryFactory
                .selectFrom(alarm)
                .where(alarm.targetAccount.eq(account))
                .orderBy(alarm.recieveDate.desc())
                .fetch();
    }
}
