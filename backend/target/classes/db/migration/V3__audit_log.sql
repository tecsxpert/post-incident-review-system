CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,

    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id BIGINT,

    performed_by VARCHAR(100),
    details TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_log(entity);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);