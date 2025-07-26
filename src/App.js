import React, { useState, useEffect, useRef } from 'react';

// Raw CSV data parsed from "symptom_drug_mapping.xlsx - Sheet1.csv"
// This data is hardcoded for demonstration purposes. In a real application,
// this would be fetched from a backend API or a more robust data source.
const rawDrugData = [
  {"อาการ":"เวียนศีรษะ","ยาแนะนำ":"Dimenhydrinate 50 mg tab","ขนาดในผู้ใหญ่":"50-100 mg ทุก 4-6 ชม. เวลามีอาการ","ขนาดในเด็ก":"1.25 mg/kg/dose ทุก 6 ชม. (สูงสุด 5 dose/วัน)","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"เวียนศีรษะ","ยาแนะนำ":"Betahistine 6 mg tab","ขนาดในผู้ใหญ่":"8-16 mg วันละ 2-3 ครั้ง","ขนาดในเด็ก":"ไม่แนะนำในเด็ก < 18 ปี","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง"},
  {"อาการ":"ปวดหัว","ยาแนะนำ":"Paracetamol 500 mg tab","ขนาดในผู้ใหญ่":"500-1000 mg ทุก 4-6 ชม. ไม่เกิน 4 g/วัน","ขนาดในเด็ก":"10-15 mg/kg/dose ทุก 4-6 ชม. ไม่เกิน 5 dose/วัน","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ปวดหัว","ยาแนะนำ":"Ibuprofen 400 mg tab","ขนาดในผู้ใหญ่":"200-400 mg ทุก 6-8 ชม. หลังอาหาร","ขนาดในเด็ก":"5-10 mg/kg/dose ทุก 6-8 ชม. (สูงสุด 40 mg/kg/วัน)","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหากเป็น CKD ระยะ 3 ขึ้นไป"},
  {"อาการ":"ปวดหัว","ยาแนะนำ":"Diclofenac 25 mg tab","ขนาดในผู้ใหญ่":"25-50 mg วันละ 2-3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำให้ใช้ในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหรือใช้ด้วยความระมัดระวังใน CKD"},
  {"อาการ":"ปวดหัว","ยาแนะนำ":"Tolperisone 50 mg tab","ขนาดในผู้ใหญ่":"50-150 mg วันละ 3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำในเด็ก <18 ปี","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง ไม่มีข้อมูลเพียงพอ"},
  {"อาการ":"ปวดข้อ/ปวดกล้ามเนื้อ","ยาแนะนำ":"Paracetamol 500 mg tab","ขนาดในผู้ใหญ่":"500-1000 mg ทุก 4-6 ชม. ไม่เกิน 4 g/วัน","ขนาดในเด็ก":"10-15 mg/kg/dose ทุก 4-6 ชม. ไม่เกิน 5 dose/วัน","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ปวดข้อ/ปวดกล้ามเนื้อ","ยาแนะนำ":"Ibuprofen 400 mg tab","ขนาดในผู้ใหญ่":"200-400 mg ทุก 6-8 ชม. หลังอาหาร","ขนาดในเด็ก":"5-10 mg/kg/dose ทุก 6-8 ชม. (สูงสุด 40 mg/kg/วัน)","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหากเป็น CKD ระยะ 3 ขึ้นไป"},
  {"อาการ":"ปวดข้อ/ปวดกล้ามเนื้อ","ยาแนะนำ":"Diclofenac 25 mg tab","ขนาดในผู้ใหญ่":"25-50 mg วันละ 2-3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำให้ใช้ในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหรือใช้ด้วยความระมัดระวังใน CKD"},
  {"อาการ":"ปวดข้อ/ปวดกล้ามเนื้อ","ยาแนะนำ":"Tolperisone 50 mg tab","ขนาดในผู้ใหญ่":"50-150 mg วันละ 3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำในเด็ก <18 ปี","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง ไม่มีข้อมูลเพียงพอ"},
  {"อาการ":"ปวดฟัน","ยาแนะนำ":"Paracetamol 500 mg tab","ขนาดในผู้ใหญ่":"500-1000 mg ทุก 4-6 ชม. ไม่เกิน 4 g/วัน","ขนาดในเด็ก":"10-15 mg/kg/dose ทุก 4-6 ชม. ไม่เกิน 5 dose/วัน","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ปวดฟัน","ยาแนะนำ":"Ibuprofen 400 mg tab","ขนาดในผู้ใหญ่":"200-400 mg ทุก 6-8 ชม. หลังอาหาร","ขนาดในเด็ก":"5-10 mg/kg/dose ทุก 6-8 ชม. (สูงสุด 40 mg/kg/วัน)","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหากเป็น CKD ระยะ 3 ขึ้นไป"},
  {"อาการ":"ปวดฟัน","ยาแนะนำ":"Diclofenac 25 mg tab","ขนาดในผู้ใหญ่":"25-50 mg วันละ 2-3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำให้ใช้ในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหรือใช้ด้วยความระมัดระวังใน CKD"},
  {"อาการ":"ปวดประจำเดือน","ยาแนะนำ":"Paracetamol 500 mg tab","ขนาดในผู้ใหญ่":"500-1000 mg ทุก 4-6 ชม. ไม่เกิน 4 g/วัน","ขนาดในเด็ก":"10-15 mg/kg/dose ทุก 4-6 ชม. ไม่เกิน 5 dose/วัน","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ปวดประจำเดือน","ยาแนะนำ":"Ibuprofen 400 mg tab","ขนาดในผู้ใหญ่":"200-400 mg ทุก 6-8 ชม. หลังอาหาร","ขนาดในเด็ก":"5-10 mg/kg/dose ทุก 6-8 ชม. (สูงสุด 40 mg/kg/วัน)","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหากเป็น CKD ระยะ 3 ขึ้นไป"},
  {"อาการ":"ปวดประจำเดือน","ยาแนะนำ":"Mefenamic acid 500 mg tab","ขนาดในผู้ใหญ่":"500 mg 3 ครั้ง/วัน หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำในเด็ก < 14 ปี","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหากเป็น CKD ระยะ 3 ขึ้นไป"},
  {"อาการ":"ปวดท้อง","ยาแนะนำ":"Buscopan 10 mg tab","ขนาดในผู้ใหญ่":"10-20 mg วันละ 3-5 ครั้ง","ขนาดในเด็ก":"6-12 ปี: 10 mg วันละ 3 ครั้ง, < 6 ปี: ไม่แนะนำ","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ปวดท้อง","ยาแนะนำ":"Activated charcoal 250 mg tab","ขนาดในผู้ใหญ่":"250-500 mg ทุก 4-6 ชม.","ขนาดในเด็ก":"250 mg ทุก 4-6 ชม.","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ท้องเสีย","ยาแนะนำ":"Oral rehydration salt (ORS)","ขนาดในผู้ใหญ่":"จิบเรื่อยๆ","ขนาดในเด็ก":"จิบบ่อยๆ","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ท้องเสีย","ยาแนะนำ":"Activated charcoal 250 mg tab","ขนาดในผู้ใหญ่":"250-500 mg ทุก 4-6 ชม.","ขนาดในเด็ก":"250 mg ทุก 4-6 ชม.","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ท้องเสีย","ยาแนะนำ":"Loperamide 2 mg tab","ขนาดในผู้ใหญ่":"4 mg ครั้งแรก จากนั้น 2 mg หลังถ่ายเหลวทุกครั้ง ไม่เกิน 16 mg/วัน","ขนาดในเด็ก":"ไม่แนะนำในเด็ก < 6 ปี","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง"},
  {"อาการ":"ท้องผูก/ริดสีดวงทวาร","ยาแนะนำ":"Magnesium hydroxide suspension","ขนาดในผู้ใหญ่":"15-30 ml ก่อนนอน","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ระวังภาวะ Mg สูงในผู้ป่วยไตบกพร่อง"},
  {"อาการ":"ท้องผูก/ริดสีดวงทวาร","ยาแนะนำ":"Bisacodyl 5 mg tab","ขนาดในผู้ใหญ่":"5-10 mg ก่อนนอน","ขนาดในเด็ก":"0.3 mg/kg ก่อนนอน","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ท้องผูก/ริดสีดวงทวาร","ยาแนะนำ":"Duphalac 10 g/15 ml","ขนาดในผู้ใหญ่":"15-30 ml ก่อนนอน","ขนาดในเด็ก":"1-2 ml/kg ก่อนนอน","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ปัสสาวะแสบขัด","ยาแนะนำ":"Potassium citrate powder","ขนาดในผู้ใหญ่":"1 ซอง ละลายน้ำดื่ม วันละ 3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ระวังภาวะ K สูงในผู้ป่วยไตบกพร่อง"},
  {"อาการ":"ตกขาว","ยาแนะนำ":"Clotrimazole vaginal tablet 100 mg","ขนาดในผู้ใหญ่":"1 เม็ด สอดช่องคลอด วันละ 1 ครั้ง ก่อนนอน 7 วัน","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ตกขาว","ยาแนะนำ":"Metronidazole 400 mg tab","ขนาดในผู้ใหญ่":"400 mg วันละ 3 ครั้ง หลังอาหาร 7 วัน","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง"},
  {"อาการ":"แผล","ยาแนะนำ":"Povidone iodine solution","ขนาดในผู้ใหญ่":"ทาบริเวณแผล วันละ 2-3 ครั้ง","ขนาดในเด็ก":"ทาบริเวณแผล วันละ 2-3 ครั้ง","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"แผล","ยาแนะนำ":"Hydrogen peroxide solution","ขนาดในผู้ใหญ่":"ล้างแผล วันละ 2-3 ครั้ง","ขนาดในเด็ก":"ล้างแผล วันละ 2-3 ครั้ง","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ผื่นผิวหนัง","ยาแนะนำ":"Hydrocortisone cream 1%","ขนาดในผู้ใหญ่":"ทาบางๆ วันละ 2-3 ครั้ง","ขนาดในเด็ก":"ทาบางๆ วันละ 2-3 ครั้ง","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"ผื่นผิวหนัง","ยาแนะนำ":"Calamine lotion","ขนาดในผู้ใหญ่":"ทาบริเวณที่มีอาการ วันละ 2-3 ครั้ง","ขนาดในเด็ก":"ทาบริเวณที่มีอาการ วันละ 2-3 ครั้ง","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"อาการระคายทางตา","ยาแนะนำ":"Artificial tears eye drop","ขนาดในผู้ใหญ่":"หยอดตาวันละ 4 ครั้ง","ขนาดในเด็ก":"เช่นเดียวกับผู้ใหญ่","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"อาการระคายทางตา","ยาแนะนำ":"Antazolin eye Drop","ขนาดในผู้ใหญ่":"หยอดตาวันละ 4 ครั้ง","ขนาดในเด็ก":"น้ำตาเทียมเท่านั้น","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ไข้ ไอ เจ็บคอ","ยาแนะนำ":"Paracetamol 500 mg tab","ขนาดในผู้ใหญ่":"500-1000 mg ทุก 4-6 ชม. ไม่เกิน 4 g/วัน","ขนาดในเด็ก":"10-15 mg/kg/dose ทุก 4-6 ชม. ไม่เกิน 5 dose/วัน","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ไข้ ไอ เจ็บคอ","ยาแนะนำ":"Acetylcysteine 100 mg powder","ขนาดในผู้ใหญ่":"1ซอง จิบเวลาไอ","ขนาดในเด็ก":"1ซอง จิบเวลาไอ","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ไข้ ไอ เจ็บคอ","ยาแนะนำ":"ยาแก้ไอมะขามป้อม","ขนาดในผู้ใหญ่":"จิบบ่อยๆ","ขนาดในเด็ก":"จิบบ่อยๆ","คำเตือนในผู้ป่วยโรคไต":""},
  {"อาการ":"ไข้ ไอ เจ็บคอ","ยาแนะนำ":"Diclofenac 25 mg tab","ขนาดในผู้ใหญ่":"25-50 mg วันละ 2-3 ครั้ง หลังอาหาร","ขนาดในเด็ก":"ไม่แนะนำให้ใช้ในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรหลีกเลี่ยงหรือใช้ด้วยความระมัดระวังใน CKD"},
  {"อาการ":"น้ำมูก คัดจมูก","ยาแนะนำ":"Chlorpheniramine 4 mg tab","ขนาดในผู้ใหญ่":"4 mg ทุก 6 ชม.","ขนาดในเด็ก":"0.1 mg/kg ทุก 6 ชม.","คำเตือนในผู้ป่วยโรคไต":"ระวังฤทธิ์กด CNS"},
  {"อาการ":"มีแผลในปาก","ยาแนะนำ":"Triamcinolone acetonide oral paste","ขนาดในผู้ใหญ่":"ทาบริเวณแผลวันละ 2-3 ครั้ง","ขนาดในเด็ก":"เหมือนผู้ใหญ่","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"อาการคันผิวหนัง/ศีรษะ","ยาแนะนำ":"Chlorpheniramine 4 mg tab","ขนาดในผู้ใหญ่":"4 mg ทุก 6 ชม.","ขนาดในเด็ก":"0.1 mg/kg ทุก 6 ชม.","คำเตือนในผู้ป่วยโรคไต":"หลีกเลี่ยงถ้าผู้ป่วยง่วงมาก"},
  {"อาการ":"อาการนอนไม่หลับ","ยาแนะนำ":"Lorazepam 0.5 mg tab","ขนาดในผู้ใหญ่":"0.5-2 mg ก่อนนอน (ปรับตามการตอบสนอง)","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง อาจต้องปรับขนาดยาในผู้ป่วยไตบกพร่องรุนแรง"},
  {"อาการ":"อาการนอนไม่หลับ","ยาแนะนำ":"Amitriptyline 10 mg tab","ขนาดในผู้ใหญ่":"10-25 mg ก่อนนอน (ปรับเพิ่มได้)","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวัง อาจต้องปรับขนาดยาในผู้ป่วยไตบกพร่องรุนแรง"},
  {"อาการ":"เมารถ เมาเรือ","ยาแนะนำ":"Dimenhydrinate 50 mg tab","ขนาดในผู้ใหญ่":"50-100 mg ก่อนเดินทาง 30 นาที","ขนาดในเด็ก":"1.25 mg/kg/dose ก่อนเดินทาง 30 นาที","คำเตือนในผู้ป่วยโรคไต":"ระวังอาการง่วงมากในผู้ป่วยโรคไต"},
  {"อาการ":"เบื่ออาหารโดยไม่มีโรคร่วม","ยาแนะนำ":"Vitamin B complex","ขนาดในผู้ใหญ่":"วันละ 1 เม็ด","ขนาดในเด็ก":"ไม่แนะนำในเด็ก","คำเตือนในผู้ป่วยโรคไต":"ปลอดภัย"},
  {"อาการ":"คลื่นไส้ อาเจียน","ยาแนะนำ":"Domperidone 10 mg tab","ขนาดในผู้ใหญ่":"10 mg ก่อนอาหาร 15-30 นาที วันละ 3 ครั้ง","ขนาดในเด็ก":"0.25 mg/kg ก่อนอาหาร 15-30 นาที วันละ 3 ครั้ง","คำเตือนในผู้ป่วยโรคไต":"ควรใช้ด้วยความระมัดระวังใน CKD"},
  {"อาการ":"คลื่นไส้ อาเจียน","ยาแนะนำ":"Dimenhydrinate 50 mg tab","ขนาดในผู้ใหญ่":"50-100 mg ทุก 4-6 ชม. เวลามีอาการ","ขนาดในเด็ก":"1.25 mg/kg/dose ทุก 6 ชม. (สูงสุด 5 dose/วัน)","คำเตือนในผู้ป่วยโรคไต":"ระวังอาการง่วงมากในผู้ป่วยโรคไต"},
  {"อาการ":"อาการแพ้ยา/แพ้อาหารเล็กน้อย/แมลงกัดต่อย","ยาแนะนำ":"Chlorpheniramine 4 mg tab","ขนาดในผู้ใหญ่":"4 mg ทุก 6 ชม.","ขนาดในเด็ก":"0.1 mg/kg ทุก 6 ชม.","คำเตือนในผู้ป่วยโรคไต":"หลีกเลี่ยงถ้าผู้ป่วยง่วงมาก"}
];

// Process raw data into a more usable structure
const drugDataBySymptom = rawDrugData.reduce((acc, item) => {
  const symptom = item['อาการ'];
  if (!acc[symptom]) {
    acc[symptom] = [];
  }
  acc[symptom].push({
    drugName: item['ยาแนะนำ'],
    adultDose: item['ขนาดในผู้ใหญ่'],
    childDose: item['ขนาดในเด็ก'],
    kidneyWarning: item['คำเตือนในผู้ป่วยโรคไต'],
  });
  return acc;
}, {});

// List of all available symptoms for suggestions
const allSymptoms = Object.keys(drugDataBySymptom);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      { type: 'bot', text: 'สวัสดีครับ ผมคือ **ผู้ช่วยเภสัชกร AI** ที่ออกแบบมาเพื่อสนับสนุนบุคลากรทางการแพทย์ในการตัดสินใจรักษา 👩‍⚕️💊' },
      { type: 'bot', text: 'Chatbot นี้มีฐานข้อมูลยาในโรงพยาบาลโพธิ์ศรีสุวรรณเท่านั้นครับ ✨' },
      { type: 'bot', text: 'คุณสามารถพิมพ์อาการ เช่น "ปวดหัว", "ไข้ ไอ เจ็บคอ", "ท้องเสีย" หรือเลือกจากรายการด้านล่างนี้ได้เลยครับ 👇' },
      { type: 'bot', text: 'หากต้องการทราบขนาดยาของยาเฉพาะเจาะจง ให้พิมพ์ **ชื่อยา** ตามด้วย **ขนาดยาที่เหมาะสม** เช่น "Paracetamol ขนาดยาที่เหมาะสม" ครับ' }
    ]);
  }, []);

  const callGeminiAPI = async (promptText) => {
    setIsLoading(true);
    let chatHistory = [{ role: "user", parts: [{ text: promptText }] }];
    const payload = { contents: chatHistory };
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]) {
        return result.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", result);
        return "ขออภัยครับ AI ไม่สามารถให้คำตอบได้ในขณะนี้ กรุณาลองอีกครั้งในภายหลัง 😔";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองอีกครั้งในภายหลัง 🔌";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { type: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(''); // Clear input immediately

    const lowerCaseInput = input.trim().toLowerCase();
    let botResponse = '';
    let isDirectMatch = false;

    const dosageQueryMatch = lowerCaseInput.match(/(.+)\s+ขนาดยาที่เหมาะสม/);
    if (dosageQueryMatch?.[1]) {
      const drugNameQuery = dosageQueryMatch[1].trim();
      const foundDrugs = rawDrugData.filter(drug => drug['ยาแนะนำ'].toLowerCase().includes(drugNameQuery));

      if (foundDrugs.length > 0) {
        botResponse += `ข้อมูลขนาดยาสำหรับ "${drugNameQuery}" ครับ:\n\n`;
        foundDrugs.forEach(drug => {
          botResponse += `💊 **${drug.ยาแนะนำ}**\n- **ขนาดในผู้ใหญ่:** ${drug.ขนาดในผู้ใหญ่}\n- **ขนาดในเด็ก:** ${drug.ขนาดในเด็ก}\n`;
          botResponse += `- **คำเตือนในผู้ป่วยโรคไต:** ${drug.คำเตือนในผู้ป่วยโรคไต || 'ไม่มีข้อมูลเฉพาะเจาะจง'}\n\n`;
        });
        isDirectMatch = true;
      }
    }

    if (!isDirectMatch) {
      const foundDrugsByName = rawDrugData.filter(drug => drug['ยาแนะนำ'].toLowerCase().includes(lowerCaseInput));
      if (foundDrugsByName.length > 0) {
        botResponse += `ข้อมูลสำหรับยา "${input.trim()}" ครับ:\n\n`;
        foundDrugsByName.forEach(drug => {
          botResponse += `💊 **${drug.ยาแนะนำ}**\n- **อาการที่เกี่ยวข้อง:** ${drug.อาการ}\n- **ขนาดในผู้ใหญ่:** ${drug.ขนาดในผู้ใหญ่}\n- **ขนาดในเด็ก:** ${drug.ขนาดในเด็ก}\n`;
          botResponse += `- **คำเตือนในผู้ป่วยโรคไต:** ${drug.คำเตือนในผู้ป่วยโรคไต || 'ไม่มีข้อมูลเฉพาะเจาะจง'}\n\n`;
        });
        isDirectMatch = true;
      }
    }

    if (!isDirectMatch) {
      const matchedSymptom = allSymptoms.find(symptom => lowerCaseInput.includes(symptom.toLowerCase()));
      if (matchedSymptom) {
        const drugs = drugDataBySymptom[matchedSymptom];
        botResponse += `สำหรับอาการ **"${matchedSymptom}"** มียาแนะนำดังนี้ครับ:\n\n`;
        drugs.forEach(drug => {
          botResponse += `💊 **${drug.drugName}**\n- **ขนาดในผู้ใหญ่:** ${drug.adultDose}\n- **ขนาดในเด็ก:** ${drug.childDose}\n`;
          botResponse += `- **คำเตือนในผู้ป่วยโรคไต:** ${drug.kidneyWarning || 'ไม่มีข้อมูลเฉพาะเจาะจง'}\n\n`;
        });
        isDirectMatch = true;
      }
    }

    let finalBotResponse;
    if (isDirectMatch) {
        finalBotResponse = botResponse + '⚠️ **ข้อควรพิจารณาสำหรับบุคลากรทางการแพทย์:** ข้อมูลนี้เป็นเพียงคำแนะนำเบื้องต้นเพื่อสนับสนุนการตัดสินใจ ไม่สามารถใช้แทนการวินิจฉัยทางคลินิก การประเมินผู้ป่วยรายบุคคล หรือแนวปฏิบัติทางการแพทย์ที่เป็นมาตรฐานได้ โปรดพิจารณาข้อมูลผู้ป่วยอย่างรอบคอบและปรึกษาผู้เชี่ยวชาญเพิ่มเติมหากมีข้อสงสัย 🙏';
    } else {
        const aiPrompt = `ในฐานะผู้ช่วยเภสัชกร AI สำหรับบุคลากรทางการแพทย์ โปรดให้ข้อมูลและคำแนะนำเบื้องต้นที่เกี่ยวข้องกับการตัดสินใจทางคลินิกสำหรับอาการหรือคำถามเกี่ยวกับยา "${input.trim()}" โดยเน้นข้อมูลที่สำคัญสำหรับแพทย์หรือบุคลากรทางการแพทย์ เช่น ข้อควรพิจารณาในการรักษา, การวินิจฉัยแยกโรคเบื้องต้น, ข้อควรระวัง, หรือข้อมูลยาที่เกี่ยวข้อง (หากมี) โปรดระบุด้วยว่าข้อมูลนี้เป็นเพียงข้อมูลสนับสนุน ไม่ใช่การวินิจฉัยหรือคำสั่งการรักษา`;
        const aiResponse = await callGeminiAPI(aiPrompt);
        finalBotResponse = aiResponse + '\n\n⚠️ **ข้อควรพิจารณาจาก AI สำหรับบุคลากรทางการแพทย์:** ข้อมูลนี้สร้างโดย AI เพื่อเป็นข้อมูลสนับสนุนเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยทางคลินิก การประเมินผู้ป่วยรายบุคคล หรือแนวปฏิบัติทางการแพทย์ที่เป็นมาตรฐานได้ โปรดพิจารณาข้อมูลผู้ป่วยอย่างรอบคอบและปรึกษาผู้เชี่ยวชาญเพิ่มเติมหากมีข้อสงสัย 🙏';
    }
    
    setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: finalBotResponse }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleSymptomClick = (symptom) => {
    setInput(symptom);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 font-inter antialiased">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .chat-message {
          max-width: 85%;
          padding: 12px 18px;
          border-radius: 18px;
          margin-bottom: 12px;
          word-wrap: break-word;
          animation: fadeIn 0.3s ease-out;
          line-height: 1.6;
        }
        .chat-message.user {
          background-color: #e3f2fd;
          color: #1e3a8a;
          align-self: flex-end;
        }
        .chat-message.bot {
          background-color: #ffffff;
          color: #374151;
          align-self: flex-start;
          border: 1px solid #e5e7eb;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .suggestion-chip {
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          border: 1px solid #d1d5db;
          color: #4b5563;
          background-color: #f9fafb;
          padding: 8px 16px;
        }
        .suggestion-chip:hover {
          background-color: #e5e7eb;
          border-color: #9ca3af;
        }
        .send-button {
          background-color: #3b82f6;
          transition: background-color 0.2s ease-in-out;
        }
        .send-button:hover { background-color: #2563eb; }
        .send-button:disabled { background-color: #9ca3af; }
        .input-field-container {
          background-color: #ffffff;
          border: 1px solid #d1d5db;
        }
        .input-field {
          background-color: transparent;
        }
        .input-field:focus {
          outline: none;
          box-shadow: none;
        }
        `}
      </style>
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`chat-message ${msg.type}`}
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                ></div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="chat-message bot">
                  <div className="flex items-center text-gray-500">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-3"></span>
                    กำลังคิดคำตอบ...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {allSymptoms.slice(0, 12).map((symptom) => ( // Show a limited number of suggestions
              <span
                key={symptom}
                className="suggestion-chip text-sm font-medium rounded-full"
                onClick={() => handleSymptomClick(symptom)}
              >
                {symptom}
              </span>
            ))}
          </div>

          <div className="flex items-center rounded-2xl shadow-sm overflow-hidden input-field-container p-2">
            <input
              type="text"
              className="flex-1 py-3 px-5 text-base text-gray-800 focus:outline-none input-field"
              placeholder="พิมพ์อาการหรือชื่อยาที่นี่..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="send-button text-white font-semibold rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <div className="text-center text-gray-400 text-xs mt-3">
            จัดทำโดย เภสัชกรเมธี แสนการุณ
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
