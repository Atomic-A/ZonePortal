import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

const dataFilePath = path.join(process.cwd(), 'data.json');

// Check if we should use Vercel Postgres
const usePostgres = () => {
  return !!process.env.POSTGRES_URL;
};

const getDefaultTemplateData = () => {
  // If data.json exists, use it as default template data
  if (fs.existsSync(dataFilePath)) {
    try {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileData);
    } catch (e) {
      // ignore and use fallback template
    }
  }

  const defaultNews = [
    { 
      id: Date.now(), 
      title: "New Water Pipeline Sanctioned", 
      category: "Ward Updates", 
      ward: 15, 
      status: "Published", 
      pinned: true, 
      date: new Date().toISOString().split('T')[0],
      content: "A major pipeline replacement has been sanctioned."
    }
  ];

  const defaultRequests = [
    { id: "REQ-2024-0891", name: "Suresh K.", type: "Welfare Scheme App", ward: 12, date: "May 12, 2024", status: "Pending", description: "Application for agricultural subsidy support." },
    { id: "REQ-2024-0892", name: "Priya V.", type: "Street Light Repair", ward: 4, date: "May 11, 2024", status: "In Progress", description: "The street lights on Sector 4 Main Road have been broken for 3 days." },
    { id: "REQ-2024-0893", name: "Ramesh Babu", type: "Road Maintenance", ward: 48, date: "May 10, 2024", status: "Resolved", description: "Potholes on the ward main road are causing severe traffic delays." },
    { id: "REQ-2024-0894", name: "Lakshmi M.", type: "Pension Scheme App", ward: 12, date: "May 09, 2024", status: "Pending", description: "Application for Senior Citizens Pension." },
    { id: "REQ-2024-0895", name: "Karthik P.", type: "Water Supply Issue", ward: 25, date: "May 09, 2024", status: "In Progress", description: "Water pressure has been extremely low for the past week." }
  ];

  const defaultSchemes = {
    "Farmers": [
      { id: 1, title: "PM-KISAN (Kisan Samman Nidhi)", desc: "An initiative by the Government of India providing minimum income support of ₹6,000 per year to all landholding farmer families.", eligibility: "All landholding farmers' families with cultivable landholding in their names.", docs: ["Aadhaar Card", "Land Ownership Details", "Bank Account Details"], link: "https://pmkisan.gov.in/" },
      { id: 2, title: "Pradhan Mantri Fasal Bima Yojana", desc: "A comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss/damage arising out of unforeseen events.", eligibility: "All farmers growing notified crops in a notified area.", docs: ["Sowing Certificate", "Bank Passbook", "Land Records"], link: "https://pmfby.gov.in/" }
    ],
    "Students": [
      { id: 3, title: "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme", desc: "Also known as the 'Pudhumai Penn' scheme, it provides ₹1000/month to girls who studied in government schools from Class 6 to 12 until they complete their UG degree/diploma/ITI.", eligibility: "Girls who studied in TN Govt schools from 6th to 12th standard.", docs: ["School Bonafide Certificate", "Aadhaar", "Bank Account Details"], link: "https://www.pudhumaipenn.tn.gov.in/" },
      { id: 4, title: "National Scholarship Portal", desc: "A one-stop solution for multiple scholarship schemes provided by the Government of India for students across all levels of education.", eligibility: "Students from minority communities, SC/ST/OBC, and economically weaker sections.", docs: ["Income Certificate", "Marksheet", "Aadhaar", "Domicile Certificate"], link: "https://scholarships.gov.in/" }
    ],
    "Senior Citizens": [
      { id: 5, title: "Indira Gandhi National Old Age Pension Scheme", desc: "A non-contributory pension scheme that provides monthly income to senior citizens living below the poverty line.", eligibility: "Age 60 years or above, belonging to BPL category.", docs: ["Age Proof (Aadhaar/Voter ID)", "BPL Ration Card", "Bank Account Details"], link: "https://nsap.nic.in/" }
    ],
    "Women": [
      { id: 6, title: "Kalaignar Magalir Urimai Thittam", desc: "A flagship scheme of the Tamil Nadu government providing a monthly basic income of ₹1,000 to eligible women heads of households.", eligibility: "Women heads of families meeting income and landholding criteria.", docs: ["Ration Card", "Aadhaar", "Bank Passbook"], link: "https://kmut.tn.gov.in/" },
      { id: 7, title: "Pradhan Mantri Matru Vandana Yojana", desc: "A maternity benefit program providing a cash incentive of ₹5,000 for pregnant women and lactating mothers for their first living child.", eligibility: "Pregnant women and lactating mothers for first child.", docs: ["MCP Card", "Aadhaar", "Bank Passbook", "Child Birth Certificate (for 3rd installment)"], link: "https://pmmvy.wcd.gov.in/" }
    ]
  };

  const defaultPolls = {
    question: "Where should the next community funds be prioritized?",
    options: [
      { id: "opt1", text: "New Community Park in Sector 4", votes: 45 },
      { id: "opt2", text: "Upgrading the Primary Healthcare Center", "votes": 82 },
      { id: "opt3", text: "Fixing internal roads of Ward 2 & 3", "votes": 63 },
      { id: "opt4", text: "Solar street lights across main avenues", "votes": 30 }
    ]
  };

  const defaultFunds = {
    totalBudget: 50000000,
    transactions: [
      { id: "TRX-001", amount: 500000, purpose: "Ward 4 Water Pipeline", status: "Completed", date: "15 May 2026" },
      { id: "TRX-002", amount: 1250000, purpose: "Govt School Repair", status: "In Progress", date: "10 May 2026" },
      { id: "TRX-003", amount: 320000, purpose: "Street Lights Phase 1", status: "Completed", date: "02 May 2026" },
      { id: "TRX-004", amount: 800000, purpose: "Community Park", status: "Approved", date: "28 Apr 2026" }
    ]
  };

  const defaultAdmins = [
    { username: "admin", password: "admin123" }
  ];

  return {
    news: defaultNews,
    requests: defaultRequests,
    schemes: defaultSchemes,
    polls: defaultPolls,
    funds: defaultFunds,
    admins: defaultAdmins
  };
};

const initializeLocalDB = () => {
  if (!fs.existsSync(dataFilePath)) {
    const defaultData = getDefaultTemplateData();
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
  } else {
    // Merge existing data with missing defaults
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    let db = JSON.parse(fileData);
    let updated = false;

    const defaults = getDefaultTemplateData();

    if (!db.news) { db.news = defaults.news; updated = true; }
    if (!db.requests) { db.requests = defaults.requests; updated = true; }
    if (!db.schemes) { db.schemes = defaults.schemes; updated = true; }
    if (!db.polls) { db.polls = defaults.polls; updated = true; }
    if (!db.funds) { db.funds = defaults.funds; updated = true; }
    if (!db.admins) { db.admins = defaults.admins; updated = true; }

    if (updated) {
      fs.writeFileSync(dataFilePath, JSON.stringify(db, null, 2));
    }
  }
};

export const readDB = async (): Promise<any> => {
  if (usePostgres()) {
    try {
      // 1. Create table if it doesn't exist
      await sql`CREATE TABLE IF NOT EXISTS mla_portal_data (id SERIAL PRIMARY KEY, data JSONB);`;
      
      // 2. Fetch the single data row
      const { rows } = await sql`SELECT data FROM mla_portal_data LIMIT 1;`;
      
      if (rows.length === 0) {
        // Table is empty, seed with initial template data
        const defaultData = getDefaultTemplateData();
        const jsonStr = JSON.stringify(defaultData);
        await sql`INSERT INTO mla_portal_data (data) VALUES (${jsonStr});`;
        return defaultData;
      }
      
      return rows[0].data;
    } catch (error) {
      console.error('Failed to read from Vercel Postgres:', error);
      // Fallback to local default data in memory if sql fails
      return getDefaultTemplateData();
    }
  } else {
    // Local development fallback
    initializeLocalDB();
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
  }
};

export const writeDB = async (data: any): Promise<void> => {
  if (usePostgres()) {
    try {
      const jsonStr = JSON.stringify(data);
      // Try updating existing row
      const result = await sql`UPDATE mla_portal_data SET data = ${jsonStr};`;
      
      // If no row was updated, insert it
      if (result.rowCount === 0) {
        await sql`INSERT INTO mla_portal_data (data) VALUES (${jsonStr});`;
      }
    } catch (error) {
      console.error('Failed to write to Vercel Postgres:', error);
    }
  } else {
    // Local development fallback
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  }
};
