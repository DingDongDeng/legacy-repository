package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Board;
import com.querydsl.core.QueryModifiers;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.board.portfolio.domain.entity.QBoard.board;

@RequiredArgsConstructor
public class BoardRepositoryCustomImpl implements BoardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Board> getBoardList(long startNum, int pageSize) {
        return queryFactory.selectFrom(board)
                .orderBy(board.regDate.desc())
                .restrict(new QueryModifiers((long) pageSize,startNum-1))
                .fetch();
    }
}
