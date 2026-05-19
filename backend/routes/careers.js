const router = require('express').Router();

const careerData = [
  {
    id: 1,
    title: 'Software Engineer',
    skills: ['programming', 'problem-solving', 'math', 'logic'],
    description: 'Build web and mobile applications for companies',
    salary: 'PKR 80,000 - 300,000/month',
    roadmap: ['Learn Python or JavaScript', 'Data Structures & Algorithms', 'Build 3 projects', 'Learn Git & GitHub', 'Apply for internships']
  },
  {
    id: 2,
    title: 'Data Scientist',
    skills: ['math', 'statistics', 'python', 'analysis', 'research'],
    description: 'Analyze data to help companies make better decisions',
    salary: 'PKR 100,000 - 400,000/month',
    roadmap: ['Learn Python', 'Statistics & Math', 'Pandas & NumPy', 'Machine Learning basics', 'Kaggle competitions']
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    skills: ['creativity', 'design', 'communication', 'art', 'visual'],
    description: 'Design beautiful and easy-to-use interfaces',
    salary: 'PKR 60,000 - 200,000/month',
    roadmap: ['Learn Figma', 'Design principles', 'Study color theory', 'Build portfolio', 'Freelance on Fiverr']
  },
  {
    id: 4,
    title: 'Digital Marketer',
    skills: ['communication', 'creativity', 'social media', 'writing', 'marketing'],
    description: 'Promote businesses and products online',
    salary: 'PKR 50,000 - 150,000/month',
    roadmap: ['Learn SEO basics', 'Google Ads certification', 'Social media strategy', 'Google Analytics', 'Run real campaigns']
  },
  {
    id: 5,
    title: 'Cybersecurity Analyst',
    skills: ['programming', 'networking', 'problem-solving', 'security', 'math'],
    description: 'Protect systems and networks from hackers',
    salary: 'PKR 100,000 - 350,000/month',
    roadmap: ['Networking basics', 'Learn Linux', 'CompTIA Security+', 'Ethical hacking', 'Bug bounty programs']
  },
  {
    id: 6,
    title: 'Mobile App Developer',
    skills: ['programming', 'creativity', 'problem-solving', 'design'],
    description: 'Build Android and iOS mobile applications',
    salary: 'PKR 80,000 - 250,000/month',
    roadmap: ['Learn Flutter or React Native', 'Build simple apps', 'Publish on Play Store', 'Learn APIs', 'Freelance']
  },
  {
    id: 7,
    title: 'Content Creator',
    skills: ['creativity', 'writing', 'communication', 'social media', 'art'],
    description: 'Create videos, blogs and social media content',
    salary: 'PKR 30,000 - 500,000/month',
    roadmap: ['Pick your niche', 'Learn video editing', 'Start YouTube or TikTok', 'Grow audience', 'Monetize']
  },
  {
    id: 8,
    title: 'Cloud Engineer',
    skills: ['programming', 'networking', 'problem-solving', 'math', 'logic'],
    description: 'Manage cloud infrastructure on AWS, Azure or Google Cloud',
    salary: 'PKR 150,000 - 500,000/month',
    roadmap: ['Learn Linux basics', 'AWS Cloud Practitioner', 'Learn Docker', 'Kubernetes basics', 'Get certified']
  }
];

// GET all careers
router.get('/all', (req, res) => {
  res.json(careerData);
});

// POST recommend careers based on skills
router.post('/recommend', (req, res) => {
  const { skills } = req.body;

  if (!skills || skills.length === 0) {
    return res.status(400).json({ msg: 'Please provide skills' });
  }

  const scored = careerData.map(career => {
    const matched = career.skills.filter(s =>
      skills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
    );
    return { ...career, score: matched.length, matchedSkills: matched };
  });

  const sorted = scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return res.json(careerData.slice(0, 3));
  }

  res.json(sorted.slice(0, 3));
});

// GET single career by id
router.get('/:id', (req, res) => {
  const career = careerData.find(c => c.id === parseInt(req.params.id));
  if (!career) return res.status(404).json({ msg: 'Career not found' });
  res.json(career);
});

module.exports = router;