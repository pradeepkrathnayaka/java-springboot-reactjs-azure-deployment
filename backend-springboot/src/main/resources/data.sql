INSERT INTO todos (title, description, completed, priority, created_at, updated_at)
VALUES
  ('Learn Spring Boot 4', 'Explore the new features of Spring Boot 4.0', false, 'HIGH', NOW(), NOW()),
  ('Build React Frontend', 'Create a modern React 19 UI with Redux', false, 'HIGH', NOW(), NOW()),
  ('Write Unit Tests', 'Cover service and controller layers', false, 'MEDIUM', NOW(), NOW()),
  ('Setup CI/CD', 'Configure GitHub Actions pipeline', false, 'LOW', NOW(), NOW()),
  ('Deploy to Cloud', 'Deploy app to AWS or Azure', true, 'MEDIUM', NOW(), NOW());