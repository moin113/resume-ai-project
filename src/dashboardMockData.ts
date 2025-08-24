// Mock data for dashboard statistics and scan history
export const mockRootProps = {
  user: {
    name: "there",
    greeting: "Hi, there!"
  },
  stats: {
    resumes: 3,
    jobDescriptions: 2,
    scans: 1
  },
  recentScan: {
    fileName: "Md_Moin_Ashrai_2_1 docx",
    jobDescription: "Job Description from Dashboard at 1 Unknown Company",
    scanDate: "2016 21 2 297:R6 pm",
    matchPercentage: 28.48,
    keywordCount: 9.55,
    keywordBreakdown: [
      {
        keyword: "Tustrared",
        percentage: 10.34
      },
      {
        keyword: "Exhilones", 
        percentage: 100
      },
      {
        keyword: "Office",
        percentage: 4.35
      }
    ]
  }
};