
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Users, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { CustomButton } from '@/components/ui/custom-button';

const Index = () => {
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({
    hero: false,
    features: false,
    workflow: false,
    cta: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.04 * i,
      },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="pt-32 md:pt-40 pb-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center space-y-6 max-w-3xl mx-auto"
            initial="hidden"
            animate={isVisible.hero ? "visible" : "hidden"}
            variants={staggerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Streamlined Contractor Management
              </span>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight"
              variants={itemVariants}
            >
              Simplify Your <span className="text-primary">Contractor Pay</span> Process
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={itemVariants}
            >
              A modern platform designed for project managers, contractors, and reviewers to efficiently handle pay applications and financial approvals.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              variants={itemVariants}
            >
              <Link to="/register">
                <CustomButton size="lg">
                  Get Started
                  <ChevronRight size={16} className="ml-1" />
                </CustomButton>
              </Link>
              <Link to="/login">
                <CustomButton variant="outline" size="lg">
                  Sign In
                </CustomButton>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16 md:mt-24 relative rounded-xl overflow-hidden shadow-elevation"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible.hero ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                alt="ContractorPay Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 md:p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Advanced Dashboard</h3>
                  <p className="text-white/80">Complete visibility of projects, contractors, and payment status</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-8 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            animate={isVisible.features ? "visible" : "hidden"}
            variants={staggerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              variants={itemVariants}
            >
              Powerful Features for Everyone
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground"
              variants={itemVariants}
            >
              Our platform caters to the unique needs of project managers, contractors, and reviewers.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
            initial="hidden"
            animate={isVisible.features ? "visible" : "hidden"}
            variants={staggerVariants}
            custom={2}
          >
            {/* Feature 1 */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Role-Based Access</h3>
              <p className="text-muted-foreground mb-4">
                Tailored dashboards and permissions for project managers, contractors, and reviewers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Project creation and assignment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Contractor expense management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Reviewer approval workflows</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Pay Applications</h3>
              <p className="text-muted-foreground mb-4">
                Create, manage, and approve contractor pay applications with ease.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Pre-defined line items</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Receipt and invoice management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AIA G702 format export</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Review Workflow</h3>
              <p className="text-muted-foreground mb-4">
                Sequential approval process with automatic notifications.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Customizable approval chains</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Change request system</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Digital signatures</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            animate={isVisible.workflow ? "visible" : "hidden"}
            variants={staggerVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              variants={itemVariants}
            >
              Streamlined Workflow
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground"
              variants={itemVariants}
            >
              A simpler way to manage contractor payments from start to finish
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate={isVisible.workflow ? "visible" : "hidden"}
            variants={staggerVariants}
            custom={2}
          >
            {/* Step 1 */}
            <motion.div 
              className="p-6 rounded-xl border border-border bg-white dark:bg-gray-800 shadow-card relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-[40px]"></div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Project Setup</h3>
              <p className="text-muted-foreground">
                Project managers create projects and assign contractors and reviewers. Each project includes predefined line items for expenses.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="p-6 rounded-xl border border-border bg-white dark:bg-gray-800 shadow-card relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-[40px]"></div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Expense Tracking</h3>
              <p className="text-muted-foreground">
                Contractors add expenses, upload receipts, and submit pay applications for review. Financial totals are automatically calculated.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="p-6 rounded-xl border border-border bg-white dark:bg-gray-800 shadow-card relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-[40px]"></div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Approval Process</h3>
              <p className="text-muted-foreground">
                Reviewers verify pay applications in sequence. Once approved by all reviewers, the director finalizes the payment in AIA G702 format.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-6 md:px-8 bg-primary/5 dark:bg-primary/10 rounded-3xl mx-6 my-16">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate={isVisible.cta ? "visible" : "hidden"}
          variants={staggerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            variants={itemVariants}
          >
            Ready to Streamline Your Payment Process?
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join project managers and contractors who are saving time and reducing errors with our intuitive payment management system.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Link to="/register">
              <CustomButton size="lg">
                Get Started Now
              </CustomButton>
            </Link>
            <Link to="/contact">
              <CustomButton variant="outline" size="lg">
                Contact Sales
              </CustomButton>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 text-primary mb-4">
                <span className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CP</span>
                </span>
                <span className="font-medium text-xl">ContractorPay</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Simplifying contractor payment management for construction projects of all sizes.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2023 ContractorPay. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
