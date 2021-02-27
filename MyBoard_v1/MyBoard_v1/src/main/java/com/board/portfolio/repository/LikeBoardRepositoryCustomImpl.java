package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Board;
import com.board.portfolio.domain.entity.LikeBoard;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import static com.board.portfolio.domain.entity.QLikeBoard.likeBoard;

@RequiredArgsConstructor
public class LikeBoardRepositoryCustomImpl implements LikeBoardRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<LikeBoard> findByBoardAndAccount(Board board, Account account) {
        return Optional.ofNullable(
                queryFactory
                .selectFrom(likeBoard)
                .where(likeBoard.board.eq(board), likeBoard.account.eq(account))
                .fetchOne());
    }
}
