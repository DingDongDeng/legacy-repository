package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Board;
import com.board.portfolio.domain.entity.Comment;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import static com.board.portfolio.domain.entity.QComment.comment;
import static com.board.portfolio.domain.entity.QLikeComment.likeComment;

@RequiredArgsConstructor
public class CommentRepositoryCustomImpl implements CommentRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Comment> getCommentList(Board board) {
        return queryFactory
                .selectFrom(comment)
                .where(comment.board.eq(board))
                .orderBy(comment.group.asc(),comment.regDate.asc())
                .fetch();
    }

    @Override
    public Optional<Comment> getChildComment(Board board, Long group, Long commentId) {
        return Optional.ofNullable(
                queryFactory
                .selectFrom(comment)
                .where(comment.board.eq(board),comment.group.eq(group),comment.commentId.gt(commentId))
                .orderBy(comment.regDate.asc())
                .fetchFirst());
    }

    @Override
    public List<Comment> getLikedCommentList(Board board, Account account) {
        return queryFactory
                .selectFrom(comment)
                .where(comment.board.eq(board))
                .join(likeComment).on(likeComment.comment.commentId.eq(comment.commentId))
                .where(likeComment.account.eq(account))
                .fetch();
    }
}
