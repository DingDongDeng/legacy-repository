package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.BoardDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardDetailRepository extends JpaRepository<BoardDetail,Long>, BoardDetailRepositoryCustom {

}
