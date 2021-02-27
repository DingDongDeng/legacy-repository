package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Comment;
import com.board.portfolio.domain.entity.LikeComment;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import static com.board.portfolio.domain.entity.QLikeComment.likeComment;

@RequiredArgsConstructor
public class LikeCommentRepositoryCustomImpl implements LikeCommentRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<LikeComment> findByCommentAndAccount(Comment comment, Account account) {
        return Optional.ofNullable(
                queryFactory
                .selectFrom(likeComment)
                .where(likeComment.comment.eq(comment), likeComment.account.eq(account))
                .fetchOne());
    }
}
