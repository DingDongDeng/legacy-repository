package com.board.portfolio.repository;

import com.board.portfolio.domain.dto.BoardDTO;
import com.board.portfolio.domain.entity.BoardDetail;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryModifiers;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.board.portfolio.domain.entity.QBoardDetail.boardDetail;

@RequiredArgsConstructor
public class BoardDetailRepositoryCustomImpl implements BoardDetailRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<BoardDetail> getBoardList(int size) {
        return queryFactory
                .selectFrom(boardDetail)
                .orderBy(boardDetail.regDate.desc())
                .limit(size)
                .fetch();
    }

    @Override
    public List<BoardDetail> getSearchBoardList(long startNum, int pageSize, BoardDTO.Search dto) {
        BooleanBuilder builder = new BooleanBuilder();
        String keyword = dto.getKeyword();
        if (dto.isTitle()) {
            builder.or(boardDetail.title.contains(keyword));
        }
        if (dto.isContent()) {
            builder.and(boardDetail.content.contains(keyword));
        }
        if (dto.isNickname()) {
            builder.or(boardDetail.account.nickname.contains(keyword));
        }
        return queryFactory.selectFrom(boardDetail)
                .where(builder)
                .orderBy(boardDetail.regDate.desc())
                .restrict(new QueryModifiers((long) pageSize,startNum-1))
                .fetch();
    }

    @Override
    public long searchBoardCnt(BoardDTO.Search dto){
        BooleanBuilder builder = new BooleanBuilder();
        String keyword = dto.getKeyword();
        if (dto.isTitle()) {
            builder.or(boardDetail.title.contains(keyword));
        }
        if (dto.isContent()) {
            builder.or(boardDetail.content.contains(keyword));
        }
        if (dto.isNickname()) {
            builder.or(boardDetail.account.nickname.contains(keyword));
        }
        return queryFactory.selectFrom(boardDetail)
                .where(builder)
                .fetchCount();
    }
}
