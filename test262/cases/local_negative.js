/*---
description: a negative test (must throw)
negative:
  phase: runtime
  type: Test262Error
---*/
throw new Test262Error("intentional");
