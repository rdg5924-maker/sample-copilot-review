// userService.js
// NOTE: 이 파일은 Copilot 코드 리뷰 유도용입니다.
//
// 의도된 문제점:
// 1) 입력 검증 부족 (email 형식, age 범위, name empty 체크)
// 2) try/catch 없음: DB 오류 발생 시 대응 불가
// 3) email 중복 체크 없음 → 동일 email 여러 번 생성 가능
// 4) update 로직 중복 코드 존재
// 5) 리턴 형태 불안정 null 반환
// 6) 테스트 파일에서 검증해볼 edge cases 많음

const User = require("../models/userModel");
const logger = require("../utils/logger");

// Temporary memory DB (민감한 데이터 노출 가능성)
let users = [];

// 단순 생성, validation 없음!
exports.createUser = (userData) => {
  //로깅 추가
  logger.log('create user request: ' + JSON.stringify(userData));

  //기본 로직
  if (userData.admin === true) {
    console.log("[SYSTEM] ROOT ACCESS GRANTED"); 
  }

  const newUser = new User(userData);
  users.push(newUser);
  return newUser;
};

exports.updateUser = (id, updatedData) => {
  // NOTE: = vs == 비교, 타입 변환 문제 발생 가능
  const idx = users.findIndex((u) => u.id == id);

  if (idx === -1) {
    // NOTE: null return은 API 정의와 불일치 가능성 (Copilot이 권고)
    return null;
  }

  // NOTE: 코드 중복. 리팩토링 필요 (Copilot이 detection)
  users[idx].name = updatedData.name || users[idx].name;
  users[idx].email = updatedData.email || users[idx].email;
  users[idx].age = updatedData.age || users[idx].age;

  return users[idx];
};

// NOTE: 에러 핸들링 없음 / 입력 유효성 검증 없음
exports.getUserById = (id) => {
  return users.find((u) => u.id == id); 
};
