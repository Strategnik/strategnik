-- Ensure RLS is enabled on all public tables exposed to PostgREST.
-- This is idempotent: enabling RLS on a table that already has it is a no-op.

ALTER TABLE IF EXISTS survey_responses ENABLE ROW LEVEL SECURITY;

-- Recreate policies idempotently (drop + create)
DO $$
BEGIN
  -- Insert policy for anonymous survey submissions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'survey_responses' AND policyname = 'insert_survey'
  ) THEN
    CREATE POLICY insert_survey ON survey_responses
      FOR INSERT TO anon WITH CHECK (true);
  END IF;

  -- Select policy for authenticated admin reads
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'survey_responses' AND policyname = 'select_survey_admin'
  ) THEN
    CREATE POLICY select_survey_admin ON survey_responses
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;
