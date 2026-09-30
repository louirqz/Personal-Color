/**
 * AURA LUXE — Face Shape Analyzer & Hairstyle Recommendation Studio
 * Facial proportion assessment, women & men haircuts, bang styles & glasses
 */

class FaceShapeStudio {
    constructor() {
        this.currentShape = "oval";

        this.shapesData = {
            oval: {
                name: "หน้ารูปไข่ (Oval Shape)",
                ratio: "ความยาวใบหน้ามากกว่าความกว้างประมาณ 1.5 เท่า ขากรรไกรโค้งมนสวยงาม",
                svgPath: "M24 4 C13 4 5 16 5 32 C5 48 13 58 24 58 C35 58 43 48 43 32 C43 16 35 4 24 4 Z",
                desc: "รูปหน้าทรงสมดุลและมีความละมุนที่สุด สามารถทำทรงผมได้หลากหลายทรงเกือบทุกสไตล์",
                bestStylesWomen: [
                    "ผมดัดลอนคลายธรรมชาติ (Soft Waves) เพิ่มความละมุน",
                    "ผมยาวสไลด์เลเยอร์ (Layered Cut) เปิดกรอบหน้าให้โดดเด่น",
                    "บ็อบสั้นระดับคางหรือประบ่า (Lob) ดูชิคและทันสมัย",
                    "หน้าม้าซีทรู (See-through bangs) หรือหน้าม้าปัดข้าง"
                ],
                bestStylesMen: [
                    "ทรง Fade สไลด์ข้าง + หวีเสย Undercut หรือ Quiff",
                    "ทรง Textured Crop สไตล์เกาหลี",
                    "ทรง Classic Side Part แสกข้างเนี๊ยบๆ"
                ],
                bangs: "หน้าม้าซีทรู, หน้าม้าปัดข้าง, หน้าม้าเคอร์เทน (Curtain bangs)",
                glasses: "แว่นตาทรงเรขาคณิต, ทรงหยดน้ำ, ทรงแคทอาย เหมาะเกือบทุกแบบ",
                dontStyles: [
                    "หลีกเลี่ยงหน้าม้าตรงทึบหนาเตอะ เพราะจะบดบังความสมดุลของใบหน้า",
                    "ระวังผมชี้แบนลีบติดหนังศีรษะเกินไป"
                ]
            },

            round: {
                name: "หน้ากลม (Round Shape)",
                ratio: "ความกว้างของโหนกแก้มและความยาวใบหน้าใกล้เคียงกัน แก้มอิ่ม คางมน",
                svgPath: "M24 6 C10 6 6 18 6 32 C6 46 10 56 24 56 C38 56 42 46 42 32 C42 18 38 6 24 6 Z",
                desc: "ใบหน้าดูอ่อนเยาว์ น่ารักและเป็นกันเอง จุดประสงค์คือการพรางแก้มและเพิ่มความยาวให้ใบหน้า",
                bestStylesWomen: [
                    "ผมยาวดัดลอนคลายระดับอก ช่วยดึงสายตาให้หน้าดูเรียวยาว",
                    "สไลด์ผมข้างแก้ม (Face-framing layers) อำพรางความกลม",
                    "ผมแสกข้างลึก (Deep Side Part) ช่วยสร้างมุมเหลี่ยมให้หน้า",
                    "หน้าม้า Curtain Bangs หรือหน้าม้าปัดข้างยาวเลยโหนกแก้ม"
                ],
                bestStylesMen: [
                    "ทรง Pompadour หรือ High Fade เพิ่มความสูงด้านบนศีรษะ",
                    "ทรง Spiky มีเท็กซ์เจอร์เซ็ตตั้งตรงกลาง",
                    "ทรง Two-Block สไลด์สั้นด้านข้าง เน้นวอลลุ่มด้านบน"
                ],
                bangs: "หน้าม้าสไลด์ข้าง, หน้าม้า Curtain bangs (ห้ามตัดหน้าม้าตรงทึบเต่อ)",
                glasses: "แว่นตาทรงเหลี่ยม (Rectangular / Square) เพื่อสร้างคอนทราสต์มุมหน้า",
                dontStyles: [
                    "หลีกเลี่ยงผมบ็อบสั้นตรงดิ่งตัดเสมอกรามพอดี จะยิ่งเน้นให้หน้าดูกว้าง",
                    "หลีกเลี่ยงหน้าม้าตรงหนาเต่อ (Blunt Bangs)",
                    "หลีกเลี่ยงผมดัดลอนแน่นหยิกฟูรอบใบหน้า"
                ]
            },

            square: {
                name: "หน้าเหลี่ยม (Square Shape)",
                ratio: "หน้าผาก โหนกแก้ม และแนวกรามมีความกว้างใกล้เคียงกัน สันกรามคมชัด",
                svgPath: "M10 8 L38 8 C38 8 40 32 38 52 L10 52 C8 32 10 8 10 8 Z",
                desc: "โครงหน้ามีเอกลักษณ์ ทรงพลังและถ่ายรูปสวยมาก จุดสำคัญคือการลดทอนความแข็งของแนวกราม",
                bestStylesWomen: [
                    "ผมยาวลอนคลื่นใหญ่ (Loose Waves) สัมผัสนุ่มนวลกลบเหลี่ยมกราม",
                    "ผมบ็อบยาวประบ่า (Lob) ปลายงุ้มเข้าเล็กน้อย",
                    "ผมสไลด์เลเยอร์ปลายขนนก (Feathered layers)",
                    "แสกข้างหรือแสกกลางแบบพริ้วไหว ไม่ตึงเปรี๊ยะ"
                ],
                bestStylesMen: [
                    "ทรง Buzz Cut โชว์สันกรามคมชัดสไตล์มาดแมน",
                    "ทรง Side Part วอลลุ่มนุ่มนวล",
                    "ทรง Textured Quiff ช่วยเกลี่ยสัดส่วนให้สมดุล"
                ],
                bangs: "หน้าม้าซีทรูปัดข้าง, หน้าม้า Wispy bangs บางเบาพริ้ว",
                glasses: "แว่นตาทรงกลม ทรงหยดน้ำ (Round / Aviator) ช่วยเบรกเหลี่ยมกราม",
                dontStyles: [
                    "หลีกเลี่ยงผมบ็อบสั้นตรงทื่อระดับคาง (Blunt Bob)",
                    "หลีกเลี่ยงการตัดหน้าม้าตรงเป๊ะและหนา",
                    "หลีกเลี่ยงการรวบผมตึงเปรี๊ยะเปิดหมดโดยไม่มีปอยผมด้านข้าง"
                ]
            },

            heart: {
                name: "หน้ารูปหัวใจ (Heart Shape)",
                ratio: "หน้าผากและโหนกแก้มกว้าง คางเรียวแหลมชัดเจนคล้ายรูปหัวใจ",
                svgPath: "M24 10 C16 4 6 12 8 26 C10 40 24 56 24 56 C24 56 38 40 40 26 C42 12 32 4 24 10 Z",
                desc: "ใบหน้าหวานเสน่ห์ ตาและโหนกแก้มเด่น จุดโฟกัสคือการเติมเต็มวอลลุ่มช่วงปลายคางให้บาลานซ์",
                bestStylesWomen: [
                    "ผมบ็อบระดับคาง ปลายสวอนออกเล็กน้อย (Out-curl Bob) เติมเต็มช่วงคาง",
                    "ผมยาวดัดลอนตั้งแต่ระดับใบหูลงไปถึงปลายผม",
                    "หน้าม้า Curtain bangs หรือหน้าม้าปัดข้างพรางความกว้างหน้าผาก",
                    "ทรงผมรวบต่ำ (Low bun) ดึงปอยผมเคลียไหล่"
                ],
                bestStylesMen: [
                    "ทรง Medium Length ผมประบ่ามีวอลลุ่ม",
                    "ทรง Textured Fringe หน้าม้าปัดซุยๆ พรางหน้าผาก",
                    "ทรง Classic Taper Fade ที่ด้านบนไม่สูงจนเกินไป"
                ],
                bangs: "หน้าม้าสไลด์ข้าง, Curtain bangs, หน้าม้าเกาหลีแบบบาง",
                glasses: "แว่นทรง Cat-Eye อ่อนๆ หรือแว่นทรงรี / ขอบบางเบา",
                dontStyles: [
                    "หลีกเลี่ยงการเซ็ตผมด้านบนฟูสูงเกินไป เพราะจะทำให้หน้าผากดูกว้างขึ้นอีก",
                    "หลีกเลี่ยงผมซอยสั้นกุดเต่อเปิดขมับหมด"
                ]
            },

            diamond: {
                name: "ทรงเพชร (Diamond Shape)",
                ratio: "หน้าผากและคางแคบ โหนกแก้มกว้างสูงและเด่นชัดที่สุด",
                svgPath: "M24 6 L42 28 L24 56 L6 28 Z",
                desc: "โครงหน้ามีมิติโดดเด่น สวยเก๋คมคาย จุดโฟกัสคือการเปิดช่วงหน้าผากและคาง ลดความเด่นของโหนกแก้ม",
                bestStylesWomen: [
                    "ผมบ็อบประบ่าไล่เลเยอร์ช่วงปลายผม",
                    "ผมลอนคลื่นใหญ่เพิ่มวอลลุ่มช่วงกรามและคาง",
                    "หน้าม้าปัดข้างยาวเปิดขมับเล็กน้อย",
                    "ผมรวบหางม้าดึงปอยผมด้านข้างมาเคลียโหนกแก้ม"
                ],
                bestStylesMen: [
                    "ทรง Faux Hawk มีความกว้างด้านข้างพอดีๆ",
                    "ทรง Messy Fringe มีเลเยอร์ปิดขมับ",
                    "ทรง Textured Crop ให้ความกว้างช่วงหน้าผาก"
                ],
                bangs: "หน้าม้าปัดข้างสไลด์ยาว, หน้าม้าซีทรูเปิดช่วงกลางหน้าผาก",
                glasses: "แว่นตาทรง Browline หรือทรงรี Oval ขับโหนกแก้มให้นุ่มนวล",
                dontStyles: [
                    "หลีกเลี่ยงผมสั้นเปิดขมับเตียนสนิท เพราะจะเน้นโหนกแก้มให้ดูกว้างเกินไป",
                    "หลีกเลี่ยงการแสกกลางผมตรงทึบแนบหน้า"
                ]
            },

            oblong: {
                name: "หน้ารูปยาว (Oblong / Long Shape)",
                ratio: "ความยาวใบหน้ามากกว่าความกว้างชัดเจน หน้าผากสูง หรือคางยาว",
                svgPath: "M14 6 C8 6 8 20 8 36 C8 52 8 58 24 58 C40 58 40 52 40 36 C40 20 40 6 34 6 Z",
                desc: "ใบหน้าดูสง่างาม หรูหรา เป็นผู้ใหญ่ จุดสำคัญคือการลดทอนความยาวและเพิ่มวอลลุ่มความกว้างด้านข้าง",
                bestStylesWomen: [
                    "หน้าม้าตรง (Blunt bangs) หรือหน้าม้าซีทรู ช่วยลดพื้นที่หน้าผากได้ทันที",
                    "ผมดัดลอนคลื่นวอลลุ่มด้านข้าง (Side volume waves)",
                    "ผมบ็อบสั้นระดับคางหรือติ่งหู (Bob with volume)",
                    "ผมแสกข้างเพิ่มมิติแนวขวาง"
                ],
                bestStylesMen: [
                    "ทรง Side Part หรือ Comb Over เซ็ตข้างผมให้มีวอลลุ่ม",
                    "ทรง Fringe ปิดหน้าผากลดความยาวใบหน้า",
                    "ทรง Two Block ตัดสั้นข้างแบบไม่เกรียนขาวเกินไป"
                ],
                bangs: "หน้าม้าตรง, หน้าม้าซีทรูหนาปานกลาง (หน้าม้าคือเพื่อนแท้ของคนหน้ารูปยาว)",
                glasses: "แว่นตาทรงกรอบใหญ่ (Oversized), ทรงสี่เหลี่ยมจัตุรัส หรือแว่นที่มีคานแว่นคู่",
                dontStyles: [
                    "หลีกเลี่ยงผมตรงยาวแบนลีบ ไร้วอลลุ่ม (จะทำให้หน้าดูยาวยิ่งขึ้น)",
                    "หลีกเลี่ยงการเซ็ตผมยกโคนสูงปรี๊ด หรือทรง Pompadour สูงๆ",
                    "หลีกเลี่ยงการรวบตึงมวยผมสูงสุดกระหม่อม"
                ]
            }
        };

        this.init();
    }

    init() {
        this.renderShapePickers();
        this.renderRecommendations();
        this.bindEvents();
    }

    bindEvents() {
        // Face Ratio Form
        const ratioForm = document.getElementById("face-ratio-form");
        if (ratioForm) {
            ratioForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.calculateFaceRatio();
            });
        }
    }

    setShape(shapeKey) {
        if (!this.shapesData[shapeKey]) return;
        this.currentShape = shapeKey;

        document.querySelectorAll(".face-card").forEach(c => {
            c.classList.toggle("active", c.getAttribute("data-shape") === shapeKey);
        });

        this.renderRecommendations();
    }

    renderShapePickers() {
        const container = document.getElementById("face-shape-picker-grid");
        if (!container) return;

        container.innerHTML = Object.entries(this.shapesData).map(([key, data]) => `
      <div class="face-card ${key === this.currentShape ? 'active' : ''}" data-shape="${key}" onclick="window.FACE_STUDIO.setShape('${key}')">
        <svg class="face-shape-svg" viewBox="0 0 48 64">
          <path d="${data.svgPath}" />
        </svg>
        <div class="face-name">${data.name.split(" ")[0]}</div>
        <div class="face-subtext">${data.name.split(" ")[1] || ''}</div>
      </div>
    `).join("");
    }

    renderRecommendations() {
        const data = this.shapesData[this.currentShape];
        const headerEl = document.getElementById("face-analysis-header");
        const recContainer = document.getElementById("face-recommendations-content");

        if (headerEl) {
            headerEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: gap; gap: 12px;">
          <div>
            <span class="badge badge-rose" style="margin-bottom: 6px;">ผลการวิเคราะห์รูปหน้า</span>
            <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff;">${data.name}</h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">${data.ratio}</p>
            <p style="font-size: 0.85rem; color: var(--rose-400); margin-top: 2px;">💡 ${data.desc}</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.FACE_STUDIO.saveResultToProfile()">
            บันทึกผลลัพธ์ลงโปรไฟล์
          </button>
        </div>
      `;
        }

        if (!recContainer) return;

        recContainer.innerHTML = `
      <div class="hair-recommendations-box">
        <!-- Women Styles -->
        <div class="hair-style-card">
          <div class="hair-card-title">
            <span>💇‍♀️</span>
            <span>ทรงผมแนะนำสำหรับผู้หญิง</span>
          </div>
          <ul class="hair-list">
            ${data.bestStylesWomen.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>

        <!-- Men Styles -->
        <div class="hair-style-card">
          <div class="hair-card-title">
            <span>💇‍♂️</span>
            <span>ทรงผมแนะนำสำหรับผู้ชาย</span>
          </div>
          <ul class="hair-list">
            ${data.bestStylesMen.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>

        <!-- Bangs & Eyewear -->
        <div class="hair-style-card" style="border-left-color: var(--violet-400);">
          <div class="hair-card-title">
            <span>✂️</span>
            <span>สไตล์หน้าม้า & แว่นตาที่เข้ากัน</span>
          </div>
          <ul class="hair-list">
            <li style="color: #fff;"><strong>หน้าม้า:</strong> ${data.bangs}</li>
            <li style="color: #fff;"><strong>กรอบแว่น:</strong> ${data.glasses}</li>
          </ul>
        </div>

        <!-- Don't Styles -->
        <div class="hair-style-card dont">
          <div class="hair-card-title" style="color: var(--danger-500);">
            <span>🚫</span>
            <span>ทรงผมและข้อควรหลีกเลี่ยง</span>
          </div>
          <ul class="hair-list">
            ${data.dontStyles.map(s => `<li>${s}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
    }

    calculateFaceRatio() {
        const forehead = parseFloat(document.getElementById("input-forehead-width")?.value) || 14;
        const cheekbones = parseFloat(document.getElementById("input-cheekbone-width")?.value) || 14;
        const jaw = parseFloat(document.getElementById("input-jaw-width")?.value) || 12;
        const length = parseFloat(document.getElementById("input-face-length")?.value) || 19;

        let detected = "oval";

        if (length > cheekbones * 1.45) {
            detected = "oblong";
        } else if (Math.abs(length - cheekbones) < 1.5 && Math.abs(cheekbones - jaw) < 2) {
            detected = (jaw > cheekbones * 0.9) ? "square" : "round";
        } else if (forehead > jaw * 1.3 && cheekbones > jaw * 1.25) {
            detected = "heart";
        } else if (cheekbones > forehead * 1.2 && cheekbones > jaw * 1.25) {
            detected = "diamond";
        } else {
            detected = "oval";
        }

        this.setShape(detected);
        window.APP.showToast(`วิเคราะห์สัดส่วนสำเร็จ: ใบหน้าของคุณจัดอยู่ในกลุ่ม "${this.shapesData[detected].name}"`, "success");

        const recElem = document.getElementById("face-analysis-header");
        if (recElem) recElem.scrollIntoView({ behavior: "smooth" });
    }

    async saveResultToProfile() {
        const data = this.shapesData[this.currentShape];
        const user = window.AUTH.currentUser;

        const consultation = {
            customerName: user ? user.name : "คุณพิมลดา สุขใจ",
            faceShape: data.name,
            recommendedHairstyles: {
                women: data.bestStylesWomen,
                men: data.bestStylesMen,
                bangs: data.bangs,
                glasses: data.glasses
            },
            notes: `วิเคราะห์รูปหน้าได้ผลลัพธ์เป็น ${data.name}`
        };

        await window.DB.saveConsultation(consultation);

        window.DB.addUsageLog({
            action: "face_check",
            user: consultation.customerName,
            role: user?.role || "member",
            details: `วิเคราะห์รูปหน้า: ${data.name}`
        });

        window.APP.showToast(`บันทึกผลลัพธ์รูปหน้า (${data.name}) สำเร็จ`, "success");
        if (window.DASHBOARD) window.DASHBOARD.refresh();
    }
}

window.FACE_STUDIO = new FaceShapeStudio();
