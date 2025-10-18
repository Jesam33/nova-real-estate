"use client";
import React, { useState, useRef } from "react";
import {
  Home,
  DollarSign,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Menu,
  X,
  FileText,
  Users,
  Award,
  MessageSquare,
  MapPinIcon,
} from "lucide-react";
import bgHero from "./assets/images/bg-hero.webp";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jeff from "./assets/images/jeff.jpg";
import Image from "next/image";

const benefitsData = [
  {
    id: 1,
    icon: <DollarSign className="w-6 h-6" />,
    title: "Cash Offers in 24hrs",
    description: "Get a fair, no-obligation cash offer within one business day",
  },
  {
    id: 2,
    icon: <Home className="w-6 h-6" />,
    title: "Sell As-Is",
    description:
      "No repairs, no cleaning, no staging - we buy in any condition",
  },
  {
    id: 3,
    icon: <Zap className="w-6 h-6" />,
    title: "Fast Closing",
    description:
      "Close on your timeline - as fast as 7 days or when you're ready",
  },
  {
    id: 4,
    icon: <Shield className="w-6 h-6" />,
    title: "Zero Fees",
    description: "No agent commissions, no closing costs, no hidden charges",
  },
  {
    id: 5,
    icon: <CheckCircle className="w-6 h-6" />,
    title: "We Handle Everything",
    description: "All paperwork and legal details managed by our expert team",
  },
  {
    id: 6,
    icon: <Star className="w-6 h-6" />,
    title: "Local & Trusted",
    description:
      "Family-owned, serving your community with integrity since 2020",
  },
];

const faqs = [
  {
    question: "Do I pay any fees or commissions?",
    answer:
      "No. Unlike traditional real estate sales, there are no agent commissions, no closing costs, and no hidden fees. The offer we make is the amount you receive.",
  },
  {
    question: "Can I sell if I owe money on my house?",
    answer:
      "Yes! We can work with you even if you owe money on your mortgage, are behind on payments, or facing foreclosure. We'll discuss all options during our consultation.",
  },
  {
    question: "How fast can you close?",
    answer:
      "We can close as quickly as 7 days, or we can work on your timeline. You choose the closing date that works best for your situation.",
  },
  {
    question: "What condition does my house need to be in?",
    answer:
      "Any condition! We buy houses as-is. No need to clean, repair, or renovate. We handle everything after closing.",
  },
  {
    question: "Are you real estate agents?",
    answer:
      "No, we're direct buyers. We purchase properties with our own funds, which means no waiting for buyer financing and a much faster, simpler process.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We buy houses throughout Cleveland and surrounding areas in Ohio. Contact us to confirm we serve your specific location.",
  },
];

export default function NovacoreLanding() {
  const [isHovering, setIsHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    condition: "",
    reason: "",
    desiredAmount: "", // NEW: Price field
    images: [], // Image uploads
  });

    // ADD THESE LINES:
  const fileInputRef = useRef(null);

 const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  
  if (files.length === 0) return;

  // Check total images won't exceed limit
  const currentImagesCount = formData.images.length;
  if (currentImagesCount + files.length > 5) {
    const availableSlots = 5 - currentImagesCount;
    toast.error(`❌ You can only upload ${availableSlots} more image(s). Maximum 5 images allowed.`);
    files.splice(availableSlots); // Trim to available slots
  }

  let validFiles = [];
  let hasErrors = false;

  files.forEach(file => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error(`❌ ${file.name} is not a supported image format. Use JPG, PNG, or WebP.`);
      hasErrors = true;
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 500 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(`❌ ${file.name} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 5MB.`);
      hasErrors = true;
      return;
    }

    // Check if file is actually an image
    if (!file.type.startsWith('image/')) {
      toast.error(`❌ ${file.name} is not a valid image file.`);
      hasErrors = true;
      return;
    }

    validFiles.push(file);
  });

  if (validFiles.length > 0) {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));

    if (hasErrors) {
      toast.info(`✅ ${validFiles.length} image(s) uploaded successfully. Some files were skipped due to errors.`);
    } else {
      toast.success(`✅ ${validFiles.length} image(s) uploaded successfully!`);
    }
  } else if (hasErrors) {
    // toast.error('❌ No images were uploaded. Please check file requirements.');
  }

  // Reset file input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // In your NovacoreLanding component
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('name', formData.name);
      submitData.append('address', formData.address);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('condition', formData.condition);
      submitData.append('reason', formData.reason);
      submitData.append('desiredAmount', formData.desiredAmount);
      
      // Append images
      formData.images.forEach((image, index) => {
        submitData.append('images', image);
      });

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

  if (result.success) {
  // THIS PART MUST EXIST AND BE CALLED:
  console.log('📧 Sending admin notification...');
  try {
    const notificationResponse = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        desiredAmount: formData.desiredAmount,
        condition: formData.condition
      }),
    });
    
    const notificationResult = await notificationResponse.json();
    console.log('📧 Notification result:', notificationResult);
  } catch (error) {
    console.error('❌ Notification failed:', error);
  }


  // Show success toast
  toast.success('🎉 Your cash offer request has been submitted! We will contact you within 24 hours.', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  
  // Reset form
  setFormData({
    name: '',
    address: '',
    phone: '',
    email: '',
    condition: '',
    reason: '',
    desiredAmount: '',
    images: []
  });
  
  // Reset file input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
} else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ There was an error submitting your request. Please call us directly at  (216) 667-7884', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Fixed CTA Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Pulsing green dot */}
          <div className="absolute -top-1 -right-1">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="absolute -inset-1 bg-green-500 rounded-full animate-ping opacity-75"></div>
              {/* Solid green dot */}
              <div className="relative w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

          <a
            href="tel:2166814859"
            className="flex items-center gap-2 bg-slate-800 rounded-4xl text-white px-6 py-3 hover:bg-slate-900 transition-all duration-300 font-semibold shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </div>
      </div>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-slate-200 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-800">NovaCore</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
            >
              About Us
            </a>
            <a
              href="#sell"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
            >
              Sell Your House
            </a>
            <a
              href="#testimonials"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
            >
              Contact
            </a>
          </div>

          <a
            href="tel:2166814859"
            className="hidden md:flex items-center gap-2 text-slate-800 font-semibold hover:text-slate-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
           (216) 667-7884
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 flex flex-col gap-4">
              <a
                href="#home"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
              >
                About Us
              </a>
              <a
                href="#sell"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
              >
                Sell Your House
              </a>
              <a
                href="#testimonials"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-slate-800 hover:text-slate-600 transition-colors font-medium"
              >
                Contact
              </a>
              <a href="tel:2166814859" className="text-slate-800 font-semibold">
               (216) 667-7884
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0">
          <div className="w-full h-full">
            {/* Next.js Image for optimized background */}
            <Image
              src={bgHero}
              alt="Hero Background"
              fill
              priority
              className="object-cover object-center"
              style={{ filter: "brightness(0.4) blur(1px)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 via-slate-800/10 to-slate-700/80"></div>
        </div>

        <div className="relative z-10 max-w-8xl mx-auto text-center pb-32">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 mb-8 text-white text-sm">
            <Shield className="w-4 h-4" />
            <span>BBB Rated • Locally Owned • Fast Cash Offers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            We Buy Houses in CASH
            <span className="block mt-2 text-3xl md:text-5xl ">
              Fast, Fair, and Hassle-Free
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            At NovaCore Property Solutions, we help homeowners sell quickly for
            cash — no repairs, no fees, no waiting. Whether you're facing
            foreclosure, tired of being a landlord, or just want a fast sale, we
            can help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="#sell"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="bg-white text-slate-800 font-bold text-lg px-10 py-4 hover:bg-slate-100 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                Get My Cash Offer
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovering ? "translate-x-1" : ""
                  }`}
                />
              </span>
            </a>

            <a
              href="tel:2166814859"
              className="flex items-center gap-3 bg-transparent border-2 border-white text-white font-bold text-lg px-10 py-4 hover:bg-white hover:text-slate-800 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              (216) 667-7884
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-white">
            {[
              { icon: <Award className="w-5 h-5" />, text: "BBB Rated" },
              {
                icon: <Shield className="w-5 h-5" />,
                text: "Licensed & Insured",
              },
              { icon: <Star className="w-5 h-5" />, text: "5-Star Rated" },
              { icon: <Zap className="w-5 h-5" />, text: "Close in 7 Days" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              SIMPLE PROCESS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We make selling easy. No agents, no commissions, no repairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="relative bg-white border-2 border-slate-200 p-8 hover:border-slate-800 transition-all duration-300">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center text-lg font-bold">
                  1
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Submit Your Property Info
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Fill out our quick form with your address and contact details.
                  It takes less than 2 minutes.
                </p>
              </div>
            </div>

            <div className="relative bg-white border-2 border-slate-200 p-8 hover:border-slate-800 transition-all duration-300">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center text-lg font-bold">
                  2
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Receive a Fair Cash Offer
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  We'll evaluate your property and present a no-obligation cash
                  offer within 24 hours.
                </p>
              </div>
            </div>

            <div className="relative bg-white border-2 border-slate-200 p-8 hover:border-slate-800 transition-all duration-300">
              <div className="absolute -top-5 left-8">
                <div className="w-10 h-10 bg-slate-800 text-white flex items-center justify-center text-lg font-bold">
                  3
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Close on Your Schedule
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Choose your closing date. We handle all the paperwork and you
                  get paid at closing.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-slate-800 text-white px-8 py-4">
              <p className="font-semibold">
                Average time from offer to cash:{" "}
                <span className="font-bold">10 days</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              WHY CHOOSE US
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              The NovaCore Advantage
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We're not just house buyers — we're problem solvers committed to
              making your life easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsData.map((benefit) => (
              <div
                key={benefit.id}
                className="group bg-white border border-slate-200 p-6 hover:border-slate-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-slate-800 flex items-center justify-center text-white mb-4 group-hover:bg-slate-900 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              ABOUT US
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
              Led by Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-white border-2 border-slate-200 p-4 md:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-40 bg-slate-200 mb-6 flex items-center justify-center rounded-full overflow-hidden relative">
                  <Image
                    src={jeff}
                    alt="Olotu Jeffery Great - Founder & CEO of NovaCore"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="160px"
                  />
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  Olotu Jeffery Great
                </h3>
                <p className="text-slate-600 font-semibold text-lg mb-8">
                  Founder & CEO
                </p>

                <div className="space-y-4 text-slate-700 leading-relaxed text-left">
                  <p>
                    "I founded NovaCore with one mission: to help homeowners
                    find freedom from properties that have become a burden."
                  </p>
                  <p>
                    "Whether facing foreclosure, inheritance issues, or just
                    needing a fast sale — I provide honest solutions and fair
                    offers."
                  </p>
                </div>
              </div>
            </div>

            {/* Rest of your code remains the same */}
            <div className="space-y-6">
              <div className="bg-slate-800 text-white p-4 md:p-10">
                <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
                <p className="text-slate-300 mb-6">
                  NovaCore Property Solutions is a local home-buying company
                  that helps homeowners in Cleveland and surrounding areas sell
                  their properties quickly and with peace of mind. Our goal is
                  to create win-win solutions — we buy homes as-is, so you can
                  move forward without stress.
                </p>
                <p className="text-lg font-semibold italic">
                  "Helping people find freedom from unwanted properties — one
                  house at a time."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-slate-200 p-6 text-center hover:border-slate-800 transition-colors">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    100+
                  </div>
                  <div className="text-slate-600 font-medium text-sm">
                    Houses Purchased
                  </div>
                </div>
                <div className="bg-white border-2 border-slate-200 p-6 text-center hover:border-slate-800 transition-colors">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    5+
                  </div>
                  <div className="text-slate-600 font-medium text-sm">
                    Years Experience
                  </div>
                </div>
                <div className="bg-white border-2 border-slate-200 p-6 text-center hover:border-slate-800 transition-colors col-span-2">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    $5M+
                  </div>
                  <div className="text-slate-600 font-medium text-sm">
                    Paid to Homeowners
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Statement */}
       <div className="bg-white border-2 border-slate-200 p-8 max-w-4xl mx-auto text-center">
  <p className="text-lg text-slate-700 leading-relaxed">
    <span className="font-bold text-slate-800">
      Contact Information:
    </span>
    <br />
    <span className="flex items-center justify-center gap-2 mt-4">
      <Phone className="w-4 h-4 flex-shrink-0" /> 
      <span>(216) 667-7884</span>
    </span>
       <span className="flex items-center justify-center gap-2 mt-2">
      <MapPinIcon className="w-4 h-4 flex-shrink-0" /> 
      <span>Serving Cleveland & Surrounding Ohio Areas</span>
    </span>
  </p>
</div>
        </div>
      </section>

      {/* Sell Your House Form */}
      <section id="sell" className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              GET YOUR OFFER
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Sell Your House
            </h2>
            <p className="text-lg text-slate-600">
              Fill out the form below and receive your cash offer within 24
              hours
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 border-2 border-slate-200 p-8"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Property Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 placeholder:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                  placeholder="123 Main St, Cleveland, OH"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 placeholder:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                    placeholder="(216) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 placeholder:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                    placeholder="john@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Property Condition *
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 placeholder:text-sm focus:border-slate-800 focus:outline-none transition-colors"
                >
                  <option value="">Select condition...</option>
                  <option value="good">Good Condition</option>
                  <option value="needs-repairs">Needs Repairs</option>
                  <option value="vacant">Vacant</option>
                </select>
              </div>
              {/* Image Upload Section */}
         
<div>
  <label className="block text-sm font-semibold text-slate-800 mb-2">
    Upload Property Photos (Optional)
  </label>
  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
    <input
      type="file"
      ref={fileInputRef}
      multiple
      accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
      onChange={handleImageUpload}
      className="hidden"
    />
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors mb-2"
    >
      Choose Photos
    </button>
    <p className="text-sm text-slate-600 mb-1">
      Upload up to 5 photos of your property (optional)
    </p>
    <p className="text-xs text-slate-500">
      Supported formats: JPG, PNG, WebP • Max size: 5MB per image
    </p>
    
    {/* Preview uploaded images */}
    {formData.images.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-800 mb-2">
          Selected Photos ({formData.images.length}/5):
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Property photo ${index + 1}`}
                className="w-full h-20 object-cover rounded border border-slate-200"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                {(image.size / (1024 * 1024)).toFixed(1)}MB
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Desired Sale Price *
                </label>
                <input
                  type="number"
                  name="desiredAmount"
                  required
                  value={formData.desiredAmount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none placeholder:text-sm transition-colors"
                  placeholder="Enter your desired sale price"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Why are you selling? *
                </label>
                <textarea
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full placeholder:text-sm px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your situation (foreclosure, inheritance, moving, repairs needed, etc.)..."
                ></textarea>
              </div>
              <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-800 text-white font-bold text-sm md:text-lg py-4 hover:bg-slate-900 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Submitting...
          </>
        ) : (
          <>
            Get My Cash Offer Now
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

              <p className="text-sm text-slate-600 text-center">
                We respect your privacy. Your information is kept confidential
                and will never be shared.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              SUCCESS STORIES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real stories from real people who sold their houses fast with
              NovaCore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-slate-800 text-slate-800"
                  />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                "NovaCore made selling my inherited property so easy. They
                handled everything and I got cash in 10 days. Couldn't be
                happier!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 border-2 border-slate-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Sarah M.</p>
                  <p className="text-sm text-slate-500">Cleveland, OH</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-slate-800 text-slate-800"
                  />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                "Professional, honest, and lightning fast. They bought my rental
                property as-is. No repairs needed. Highly recommend!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 border-2 border-slate-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">David R.</p>
                  <p className="text-sm text-slate-500">Akron, OH</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-slate-800 text-slate-800"
                  />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                "Facing foreclosure was terrifying, but NovaCore gave me a fair
                offer and helped me avoid it. True lifesavers!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 border-2 border-slate-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Jennifer A.</p>
                  <p className="text-sm text-slate-500">Canton, OH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              FREQUENTLY ASKED
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about selling your house to NovaCore
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border-b border-slate-200 pb-4"
              >
                <summary className="flex justify-between items-center font-semibold text-slate-800 cursor-pointer list-none py-4 hover:text-slate-600 transition-colors">
                  <span className="text-lg">{faq.question}</span>
                  <div className="transform group-open:rotate-180 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </summary>
                <p className="text-slate-600 mt-2 pl-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-800 text-white px-4 py-1 text-sm font-semibold mb-6">
              GET IN TOUCH
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ready to sell? Have questions? We're here to help you every step
              of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white border-2 border-slate-200 p-4 hover:border-slate-800 transition-colors">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12  flex items-center justify-center ">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Phone</p>
                      <a
                        href="tel:2166814859"
                        className="text-slate-600 hover:text-slate-800 transition-colors"
                      >
                       (216) 667-7884
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12  flex items-center justify-center ">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Email</p>
                      <a
                        href="mailto:novacorepropertysolutions@hotmail.com"
                        className="text-slate-600 text-[12px] max-w hover:text-slate-800 transition-colors"
                      >
                        novacorepropertysolutions@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12  flex items-center justify-center ">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        Service Area
                      </p>
                      <p className="text-slate-600">
                        Cleveland & Surrounding Ohio Areas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 text-white p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Why Choose NovaCore?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Local & Family-Owned</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>BBB Accredited</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>No Fees or Commissions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Close in as Little as 7 Days</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
                    placeholder="john@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
                    placeholder="(216) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-slate-300 focus:border-slate-800 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your property or ask any questions..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white font-bold text-lg py-4 hover:bg-slate-900 transition-colors flex items-center justify-center gap-3"
                >
                  Send Message
                  <MessageSquare className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">
                NovaCore Property Solutions
              </div>
              <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
                Helping homeowners in Cleveland and surrounding areas sell their
                properties quickly, fairly, and without the hassles of
                traditional real estate.
              </p>
              <div className="flex items-center gap-4 text-slate-300">
                <a
                  href="tel:2166814859"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (216) 667-7884
                </a>
                <a
                  href="mailto:novacorepropertysolutions@hotmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a
                    href="#home"
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#sell"
                    className="hover:text-white transition-colors"
                  >
                    Sell Your House
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} NovaCore Property Solutions. All
              rights reserved.
            </p>
            <p className="mt-2 text-sm">
              Serving Cleveland, Akron, Canton, and surrounding Ohio
              communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
