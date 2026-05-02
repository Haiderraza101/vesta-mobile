/**
 * ServiceHub Mock Data
 * Static data for all screens - replaces backend calls
 */

export const MOCK_USER = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "customer" as "customer" | "provider",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8PidblN58uIxztyO7Ssbd-mKiJWpMy6ptBxhnXYw322DjqouZ4cO_3d2cS9-_adZEQRlI5A9vLd-cr5Cenk1jGOJLEpVZOqmAkFBqd4qtKoGoXNZ10T5-LnTfr7FFh-vs3c9WLJ6LHuEmn2hQQmkaztMUXkY7OImPxmdBERhF0FC9goltDSCOBD9mIpEuoo6idnXF8e_sy6QnPuXWaEMVkUE09ouPoWcRmWGqDQcmYm4lAK8SemCksxZfVJ7HLfIYsfhZ3_P_mg6v",
  badge: "Premium Customer",
};

export const SERVICES = [
  { id: "s1", name: "Cleaning", icon: "sparkles" as const, description: "Standard, deep, and move-in/out cleaning services for your home.", featured: true },
  { id: "s2", name: "Electrical", icon: "zap" as const },
  { id: "s3", name: "Plumbing", icon: "wrench" as const },
  { id: "s4", name: "Handyman", icon: "hammer" as const },
  { id: "s5", name: "Painting", icon: "paintbrush" as const },
];

export const PROVIDERS = [
  {
    id: "p1",
    name: "John Doe",
    specialty: "Expert Electrician",
    rating: 4.8,
    jobsCompleted: 150,
    experience: 5,
    available: true,
    about: "I am a fully licensed and insured Master Electrician with over half a decade of hands-on experience handling complex residential and commercial electrical projects.",
    skills: ["Panel Upgrades", "Smart Home", "Rewiring", "Lighting Design"],
    rate: 85,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA11hGr2YAYKLxPxQ4rUSM2cIM7rYmbcEJoTBF96cwE-ESm1LNMrZGL73VBHmX5_ZQu5E287XENop9m3Erg6Oj-3Rt5FfpODZ5WeomYL7wpWBCxHS9mIc0ve2rRhxeUvD1Ij_9QTL3x4lJHK0XVw-BAhtFTwlqgBJBI-vXMeSpkqzoEj1rJothjjPZ5iKuv38IUMsH9gDnv74PjpGAFPKayFSTKLqlCRCJau1yX9jhGxrLnzokeh7DA9NaDCHugcue8h80hvcgRdEro",
  },
  {
    id: "p2",
    name: "Sarah Jenkins",
    specialty: "Master Electrician",
    rating: 4.9,
    jobsCompleted: 320,
    experience: 8,
    available: true,
    about: "Certified master electrician specializing in residential and commercial installations with a focus on energy-efficient solutions.",
    skills: ["Commercial", "Residential", "EV Charging", "Solar"],
    rate: 95,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB-N2b4ug0TXjOALEW0uPe_Hl_AoNr6aGzR_8WJ4jztMSoBqgmI7wNfaqXpBmCz91maS6Ha33U-w5Xzs2XzdRBqGHm6x0wLl5Y3LDdbufhwrcN6Ing0lTp4ShiSEZLgb49V4aZ1OYu_AWu01R5XxKTzT54bRopB5l3xd7CKCbDlKTxC6ZNvMtF16xdTBQhIP2-jBY5awteNOSSGF0RTIa3ewjt2SAyLjJ9X_tioYT5p688NJw80V3Rz57oDAGso45vSyPU9x3lSR9V",
  },
  {
    id: "p3",
    name: "Michael Chen",
    specialty: "Licensed Electrician",
    rating: 4.7,
    jobsCompleted: 85,
    experience: 3,
    available: true,
    about: "Licensed electrician with a passion for smart home technology and modern electrical solutions.",
    skills: ["Smart Home", "Troubleshooting", "Fixtures", "Wiring"],
    rate: 75,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAWX7himFBlo34Vno4MMhi8kA0rLRUT3f8h2Rd5qazBCHihj8CAB9tfjyE8n3hnK1ScNxvMkug8C7SlDhhvmVqwFQl7UhjwQUpnJxucGSKkhvux2ePSi9MDaUKuoP8BiEYlPrp3ZO0luzH8x30MlGf22fWgV0qJ607N5YhN6qiGv5b1Ipx5zbJivXHnNd_-q8H8HJ5El8-Ud7-gvRWTNkdDNF_ulGoBscDABi3og1sOAM1nQo8EZiWVB05D6Sj1L83m9rVjWBSGEk0",
  },
];

export const BOOKINGS = [
  {
    id: "b1",
    serviceType: "Electrical",
    serviceIcon: "zap" as const,
    title: "Fixing kitchen light and wiring",
    description: "Need an electrician to troubleshoot and fix flickering lights in the main kitchen area and install two new outlets.",
    status: "pending" as const,
    address: "123 Maple Street, Apt 4B",
    timeAgo: "Posted 2 hours ago",
    provider: null,
  },
  {
    id: "b2",
    serviceType: "Plumbing",
    serviceIcon: "wrench" as const,
    title: "Leaky faucet in master bath",
    description: "Constant dripping from the hot water valve. Needs part replacement and general pressure check.",
    status: "accepted" as const,
    address: "456 Oak Avenue",
    timeAgo: "Posted 1 day ago",
    provider: {
      name: "David M.",
      arrivalTime: "Arriving tomorrow, 10:00 AM",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbLMdJASbH0pU4-7SBlZN5JPbxEY1YZq7UBxMjZtwb3a4DCfyVMGkmcyKyg5sXLLLnA_uj1zLti70UmPVdEr7fS8gQXwFOdvC5RbiNxA4iZjG0L1ALQ2Esn9KDe9USz9n0q8oY8nijkTsLm0jozzObuYjHIuueMLnNDcNBeF9CprSc6i8wdwLrcgO6wa4XxycJeb88hnDw4Z4GZ1PjWCXaRs9TNomx1Qa0wqEtwbqaN-fHISQ3eIYRlqSoibSt6a2jOZR_JuRwgmh2",
    },
  },
  {
    id: "b3",
    serviceType: "Cleaning",
    serviceIcon: "sparkles" as const,
    title: "Deep cleaning before move-in",
    description: "Thorough cleaning of empty 3-bedroom apartment, including appliances, windows, and carpets.",
    status: "completed" as const,
    address: "789 Pine Lane, Unit 12",
    timeAgo: "Completed Oct 24",
    provider: null,
  },
];

export const RECENT_ACTIVITY = {
  id: "ra1",
  title: "Deep House Cleaning",
  providerName: "Sarah Jenkins",
  status: "Completed",
  date: "Yesterday",
  price: "$120",
  providerAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi7udbfCoCqwvafrsBETtJNARzLp5vSBcy3GSegAHK4XGbIaFl2QIuKxhpgEWm-OvqmeZ1E3nkS6mCVxbW4cJdPa04pPrfxigxyVltSJyBhgyFe-xty1asmxXB4B872ou9OYCehDVPwvZU4ZrDZ5XEoSd9dzsF1FB10KI0cgCHQngf2l0OZqUql9cna42rf28MMyDkfY0E0XdGKt49g-qNn3L_pd18hzAczzuwwsYppCHVWDKCfPK_o49o01Yl2eXd80kFyecvu9_c",
};

export const PROMO_BANNER = {
  tag: "Seasonal Offer",
  title: "Spring Cleaning Special",
  description: "Get your home ready for the season with 20% off all deep cleaning services. Book now to secure your spot.",
  cta: "Claim Offer",
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV8PmhiWydSGCMINnBOb5fQT41Xuu_O2vF6Wapen1t9gT0s0copUrBNjMjyyd61EVCbs9X0TeDGE2eB2Hp3Mtu35QApv_7yt9Qp0mlA3nFl6Mw8Fab4RgwqnkltmG4UtuR-82ETxcdtrINteIOoJMo2FZtH7bN_qIFqLSi_xdYkHBuhTqvBLjJkDkIOjsdZFl2ucb26NqxUeONFflwFYXKL3Zf5H87Va0eH1JLyd96pTVzXTOlb1ywcJkvM-bJNhKsXxAZYi5fByaX",
};

export const INCOMING_JOBS = [
  {
    id: "j1",
    customerName: "Sarah Jenkins",
    customerAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANtT-Uo0jkithpq-v7hd1fFs012_NawjQd33Xr2OmO0wwKtqxWyANKysTjcR2wwNzLox_FPgP5FYdob-OAo1EeRSUgHCrXOpxkXtMI4_4Av9qPtXAY0D4umsz9oZ1ACIIm6nFKz79c1NXxT8YB6v6tB0c2dOb4FFcHxaGsUOWOlDu2H7eopesm7L4-_fT3-1eHh2bcx7IB0ZPbTvKUOZKq8FNvl87N0zdKLkEdhTl1PFTnxY-YH9v2_BjfTFouwWetgipxcKW0_IaH",
    location: "842 Pinecrest Way, 2.4 mi",
    urgency: "ASAP",
    serviceType: "Cleaning",
    serviceIcon: "sparkles" as const,
    title: "Deep House Cleaning",
    description: "Complete move-out clean required. 3 bedrooms, 2 bathrooms. Please bring eco-friendly supplies. Focus on kitchen appliances and baseboards.",
    payout: "$145.00",
    isUrgent: true,
  },
  {
    id: "j2",
    customerName: "Michael Chen",
    customerAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5_7S1GNRCmHmz0_i2_6BLrqMxHTQQpDzAMGRuI6ytIyK3UwQf8a3AHCVKA_4fS2a1c52bby71rpGsi6U1c7hpkcD_evEfwfJIABn6X8O9RbYqT-jVOr0webWZzcSXf-DAYw2OBGedmJ1VqDgS4lH5t22ePqTRMGZGq-CTRdaUHuTMknEV1V5G_Xc9pg6cqs82J7pbzZxPKb00B9NXd4En5r3RWDfUp0y3Lt6WLaeqezojKpfGpZlFKTJE4lGYq-5vIFceAscF7DMD",
    location: "1902 West End Ave, 4.1 mi",
    urgency: "Today, 3:00 PM",
    serviceType: "Plumbing",
    serviceIcon: "wrench" as const,
    title: "Plumbing Repair",
    description: "Leaking pipe under the kitchen sink. Water has been shut off but needs urgent repair before evening. Suspect cracked PVC joint.",
    payout: "$85.00",
    isUrgent: false,
  },
];

export const TRADES = [
  { id: "t1", name: "Cleaning", icon: "sparkles" as const },
  { id: "t2", name: "Electrical", icon: "zap" as const },
  { id: "t3", name: "Plumbing", icon: "wrench" as const },
];

export const JOB_DETAIL = {
  id: "jd1",
  title: "Deep Cleaning Service - 3 Bedroom House",
  price: "$150.00",
  status: "Pending Review",
  customer: {
    name: "Sarah Jenkins",
    rating: 4.9,
    reviews: 12,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFxGFE2wyaw7helFiklLRSckdOBd-3Cwr6GytCfDaQHDHqkk-8YbosZ8AOaWEZnrtDsCm2-MV6ouZ8gXn-JDvRvKZLWzSvmStSgQCIvke5PJr41ubSeIRaFw2S7DcYf9-ZnrcuEGoOcMQndae4Olx9GfE1Xz5kU9uw_IlK2aw_jJSLl4Klk7B5h9Am_wGAU25oLZloPnGtzZMYYxxiBsBmaMV-lN6_8O1ro4VblLYyZxdrj_d12cr7EY4wWbW1F064z5f5O58sShcf",
  },
  date: "Thursday, Oct 26",
  time: "09:00 AM - 01:00 PM",
  address: "1248 Magnolia Blvd",
  city: "Seattle, WA 98101",
  description: "Looking for a thorough deep cleaning of a 3-bedroom, 2-bathroom single-family home. Priority areas include the kitchen (appliances inside and out, cabinets, floors) and both bathrooms (grout, fixtures). The living areas need dusting and vacuuming. We have hardwood floors throughout the first floor and carpet upstairs.",
  requirements: [
    { label: "Pet Friendly (1 Dog)", icon: "heart" as const },
    { label: "Bring Equipment", icon: "sparkles" as const },
    { label: "2 Stories", icon: "home" as const },
  ],
};

export const ACTIVE_JOB = {
  customer: {
    name: "Sarah Jenkins",
    service: "Premium Deep Clean Service",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY-0kwU3sovVEkCb6-7q-LjrpbmmOvZXxZ88ZQaIQMBEg0sf40A4nuiRAMLRBYza7_VJGHRY9asD69yFHNHheph7E9ybec-zFdsHoptQPorzJ3HyWQpS0SpuXjstdADaf4_q8R_6MKdHPH6HwvcDfweD777LAMIUW8JBjlqfxG5O0fkUN2eBuXDtKsooFBydJHO7vJKW-u_YOENs6iENU6yhVvD62WCx-1JmcrON91tOF8Bl2bWn0QDgca6xGxIX384KxnoKnxIwjR",
  },
  address: {
    street: "450 N Michigan Ave",
    detail: "Suite 12B, Chicago, IL 60611",
  },
  steps: [
    { label: "Arrived at Location", time: "09:45 AM", status: "completed" as const },
    { label: "Job Started", time: "10:00 AM", status: "current" as const },
    { label: "Completed", time: "Pending", status: "pending" as const },
  ],
};

export const AVAILABILITY_DAYS = [
  { day: "Mon", date: 12, available: true, selected: true },
  { day: "Tue", date: 13, available: true, selected: false },
  { day: "Wed", date: 14, available: false, selected: false },
  { day: "Thu", date: 15, available: true, selected: false },
  { day: "Fri", date: 16, available: true, selected: false },
];

export const TIME_SLOTS = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
