package com.board.portfolio.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FileAttachmentRepositoryCustomImpl implements FileAttachmentRepositoryCustom {
    private final JPAQueryFactory queryFactory;
}
