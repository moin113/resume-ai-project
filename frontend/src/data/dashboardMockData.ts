// Mock data for the dashboard interface
export const mockRootProps = {
  user: {
    name: "there",
    greeting: "H. there!"
  },
  stats: {
    resumes: 3,
    jobDescriptions: 2,
    scans: 1
  },
  recentScans: [
    {
      id: 1,
      fileName: "Md_Moin_Ashrai_2_1 docx",
      description: "Job Description from Dashboard at 1 Unknown Company",
      timestamp: "2016 212 207-ft6 pm",
      matchPercentage: 28.48,
      keywordCount: 9.55,
      categories: [
        { name: "Tustrated", percentage: 10.34 },
        { name: "Exhilones", percentage: 100 },
        { name: "Office", percentage: 4.35 }
      ]
    }
  ]
};