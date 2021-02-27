package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment,String>,FileAttachmentRepositoryCustom {

}
