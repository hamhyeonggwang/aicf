'use client'

import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-heading">문의 및 수정 제안</h4>
          <p className="footer-text">연구담당자 : 함형광</p>
          <p className="footer-text-small">소속기관 : 강원대학교 일반대학원 작업치료학과 석사과정</p>
          <p className="footer-text">
            포트폴리오 페이지 :{' '}
            <a href="https://i-lab.ai.kr" target="_blank" rel="noopener noreferrer" className="footer-link">
              i-lab.ai.kr
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} 강원대학교 일반대학원 작업치료학과 함형광. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

