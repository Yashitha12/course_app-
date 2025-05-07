import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Nav,
  Tab,
  Button,
  ProgressBar,
  ListGroup,
  Alert,
  Form,
} from "react-bootstrap";
import { getCourseById, getCourseContent, generateCourseContent } from "../api";
import {
  Clock,
  Globe,
  Users,
  Laptop,
  FileText,
  PlayCircle,
  HelpCircle,
  FileType,
  Lock,
  Unlock,
  Download,
  Award,
  CheckCircle,
  BookOpen,
  Tag,
} from "lucide-react";

function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseAndContent = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseData = await getCourseById(id);
        setCourse(courseData);

        // Fetch course content
        const contentData = await getCourseContent(id);

        // Check if enrolled
        const hasEnrolled = localStorage.getItem(`enrolled_${id}`) === "true";
        setCourseContent(contentData || []);
        setEnrolled(hasEnrolled);

        // Set student count
        setStudentCount(Math.floor(Math.random() * 490) + 10);

        // Set first lesson as active by default
        if (contentData && contentData.length > 0) {
          setActiveLesson(contentData[0]);
        }

        // Calculate progress (in a real app this would be based on completed lessons)
        const completedLessons = 1; // Mock data
        const totalLessons = contentData?.length || 1;
        setProgress(Math.round((completedLessons / totalLessons) * 100));

        setError(null);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndContent();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await generateCourseContent(id);

      // Refresh content after generating
      const contentData = await getCourseContent(id);
      setCourseContent(contentData || []);

      localStorage.setItem(`enrolled_${id}`, "true");
      setEnrolled(true);
      setError(null);

      if (contentData && contentData.length > 0) {
        setActiveLesson(contentData[0]);
      }

      setStudentCount((prevCount) => prevCount + 1);
    } catch (err) {
      console.error("Error enrolling in course:", err);
      setError("Failed to enroll in this course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if lesson should be previewable
  const isPreviewable = (index, lesson) => {
    if (enrolled) return true;
    return index < 2 || lesson.previewEnabled;
  };

  // Helper to render the appropriate icon for the lesson type
  const getLessonIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <PlayCircle className="text-primary" size={18} />;
      case "quiz":
        return <HelpCircle className="text-warning" size={18} />;
      case "pdf":
        return <FileType className="text-danger" size={18} />;
      default:
        return <FileText className="text-info" size={18} />;
    }
  };

  // Helper to organize content by sections
  const getContentBySections = () => {
    // This would be more sophisticated in a real app
    // For now, let's just create a simple structure
    return [
      {
        id: "section-1",
        title: "Getting Started",
        lessons: courseContent.slice(0, Math.ceil(courseContent.length / 3)),
      },
      {
        id: "section-2",
        title: "Core Concepts",
        lessons: courseContent.slice(
          Math.ceil(courseContent.length / 3),
          Math.ceil(courseContent.length / 3) * 2
        ),
      },
      {
        id: "section-3",
        title: "Advanced Topics",
        lessons: courseContent.slice(Math.ceil(courseContent.length / 3) * 2),
      },
    ];
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
    setActiveTab("content");
  };

  // Professional color scheme
  const colors = {
    primary: "#0d6efd",
    secondary: "#6c757d",
    success: "#198754",
    info: "#0dcaf0",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#f8f9fa",
    dark: "#212529",
  };

  if (loading && !course) {
    return (
      <Container className="py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-4 fs-5 fw-medium text-secondary">
          Loading course content...
        </p>
      </Container>
    );
  }

  if (error && !course) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Course not found</Alert>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Course Header */}
      <div
        className="position-relative text-white mb-4"
        style={{
          background: `linear-gradient(rgba(13, 110, 253, 0.85), rgba(25, 135, 84, 0.75)), url(${
            course.imagePath || "https://via.placeholder.com/1200x400"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "5rem 0",
        }}
      >
        <Container>
          <Row>
            <Col lg={8}>
              {/* Course category badge */}
              <Badge
                bg="light"
                text="dark"
                className="mb-3 p-2 d-inline-flex align-items-center"
              >
                <Laptop className="me-2" size={16} />{" "}
                {course.category || "General"}
              </Badge>

              {/* Course title */}
              <h1 className="display-4 fw-bold mb-3">{course.title}</h1>

              {/* Course brief description */}
              <p className="lead text-white-50 mb-4">
                {course.shortDescription ||
                  course.description?.substring(0, 120) + "..." ||
                  "Learn the essential skills and concepts"}
              </p>

              {/* Quick stats */}
              <div className="d-flex flex-wrap gap-4 mb-4">
                <div className="d-flex align-items-center">
                  <Clock className="me-2 text-white-50" size={18} />
                  <span className="text-white">
                    {course.duration || "Self-paced"}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Globe className="me-2 text-white-50" size={18} />
                  <span className="text-white">
                    {course.language || "English"}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Users className="me-2 text-white-50" size={18} />
                  <span className="text-white">{studentCount}+ enrolled</span>
                </div>
                <div className="d-flex align-items-center">
                  <Award className="me-2 text-white-50" size={18} />
                  <span className="text-white">
                    {course.level || "All Levels"}
                  </span>
                </div>
              </div>

              {/* Level indicator */}
              <Badge
                bg={
                  course.level === "Beginner"
                    ? "success"
                    : course.level === "Intermediate"
                    ? "warning"
                    : "danger"
                }
                className="py-2 px-3"
              >
                {course.level || "All Levels"}
              </Badge>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main content */}
      <Container className="mb-5">
        <Row>
          <Col lg={12}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-bottom-0">
                <Nav
                  variant="tabs"
                  className="border-bottom-0"
                  activeKey={activeTab}
                  onSelect={handleTabChange}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="content">Course Content</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="resources">Resources</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body className="p-0">
                <Tab.Content>
                  <Tab.Pane
                    eventKey="overview"
                    active={activeTab === "overview"}
                  >
                    <div className="p-4">
                      <Row>
                        {/* Course details - Left column */}
                        <Col lg={8}>
                          <h2 className="fs-2 fw-bold mb-4">
                            About this course
                          </h2>
                          <p className="text-secondary mb-4">
                            {course.description}
                          </p>

                          {/* What you'll learn */}
                          <h3 className="fs-4 fw-semibold mb-3 mt-4">
                            What you'll learn
                          </h3>
                          <Row xs={1} md={2} className="g-3 mb-4">
                            {(
                              course.learningObjectives || [
                                "Master key concepts and techniques",
                                "Build practical, real-world projects",
                                "Develop problem-solving skills",
                                "Understand industry best practices",
                              ]
                            ).map((objective, index) => (
                              <Col key={index}>
                                <div className="d-flex align-items-start">
                                  <CheckCircle
                                    className="text-success me-2 flex-shrink-0 mt-1"
                                    size={18}
                                  />
                                  <span>{objective}</span>
                                </div>
                              </Col>
                            ))}
                          </Row>

                          {/* Topics covered */}
                          {course.tags && course.tags.length > 0 && (
                            <>
                              <h3 className="fs-4 fw-semibold mb-3 mt-4">
                                Topics covered
                              </h3>
                              <div className="d-flex flex-wrap gap-2">
                                {course.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    bg="light"
                                    text="primary"
                                    className="py-2 px-3 rounded-pill d-inline-flex align-items-center"
                                  >
                                    <Tag className="me-1" size={14} /> {tag}
                                  </Badge>
                                ))}
                              </div>
                            </>
                          )}
                        </Col>

                        {/* Enrollment card - Right column */}
                        <Col lg={4}>
                          <Card className="border shadow-sm">
                            {enrolled ? (
                              <Card.Body className="p-4">
                                <h3 className="fs-5 fw-semibold mb-3">
                                  Course Progress
                                </h3>
                                <div className="mb-2">
                                  <ProgressBar
                                    now={progress}
                                    label={`${progress}%`}
                                    variant="primary"
                                    style={{ height: "8px" }}
                                    className="mb-2"
                                  />
                                </div>
                                <p className="text-secondary small mb-4 text-center">
                                  {progress}% complete
                                </p>
                                <Button
                                  variant="primary"
                                  className="w-100 py-2"
                                  onClick={() => handleTabChange("content")}
                                >
                                  Continue Learning
                                </Button>
                              </Card.Body>
                            ) : (
                              <Card.Body className="p-4">
                                <div className="d-flex justify-content-center mb-3">
                                  <Badge bg="success" className="px-3 py-2">
                                    Free
                                  </Badge>
                                </div>
                                <h3 className="fs-5 fw-semibold text-center mb-2">
                                  Enroll in this Course
                                </h3>
                                <p className="text-secondary text-center mb-4">
                                  Get full access to all course materials
                                </p>
                                <Button
                                  variant="primary"
                                  className="w-100 py-2 fw-semibold"
                                  onClick={handleEnroll}
                                  disabled={loading}
                                >
                                  {loading ? "Processing..." : "Enroll Now"}
                                </Button>
                                <p className="text-secondary small mt-3 text-center">
                                  First two lessons available for preview
                                </p>
                              </Card.Body>
                            )}

                            {/* Course includes */}
                            <ListGroup variant="flush" className="border-top">
                              <ListGroup.Item className="px-4 py-3">
                                <h4 className="fs-6 fw-medium mb-3">
                                  This course includes:
                                </h4>
                                <ul className="list-unstyled mb-0">
                                  <li className="d-flex align-items-center mb-2 text-secondary">
                                    <PlayCircle
                                      className="me-2 text-secondary"
                                      size={16}
                                    />
                                    {courseContent.filter(
                                      (item) => item.contentType === "video"
                                    ).length || 5}{" "}
                                    video lessons
                                  </li>
                                  <li className="d-flex align-items-center mb-2 text-secondary">
                                    <FileText
                                      className="me-2 text-secondary"
                                      size={16}
                                    />
                                    {courseContent.filter(
                                      (item) => item.contentType === "text"
                                    ).length || 3}{" "}
                                    reading materials
                                  </li>
                                  <li className="d-flex align-items-center mb-2 text-secondary">
                                    <HelpCircle
                                      className="me-2 text-secondary"
                                      size={16}
                                    />
                                    {courseContent.filter(
                                      (item) => item.contentType === "quiz"
                                    ).length || 2}{" "}
                                    quizzes
                                  </li>
                                  <li className="d-flex align-items-center mb-2 text-secondary">
                                    <Download
                                      className="me-2 text-secondary"
                                      size={16}
                                    />
                                    Downloadable resources
                                  </li>
                                  <li className="d-flex align-items-center text-secondary">
                                    <Award
                                      className="me-2 text-secondary"
                                      size={16}
                                    />
                                    Certificate of completion
                                  </li>
                                </ul>
                              </ListGroup.Item>
                            </ListGroup>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="content" active={activeTab === "content"}>
                    <div className="p-4">
                      <Row>
                        {/* Course Curriculum - Left sidebar */}
                        <Col lg={4} className="mb-4 mb-lg-0">
                          <Card className="h-100 border">
                            <Card.Header className="bg-light fw-medium">
                              Course Curriculum
                            </Card.Header>
                            <div
                              className="overflow-auto"
                              style={{ maxHeight: "600px" }}
                            >
                              <Accordion defaultActiveKey="section-0">
                                {getContentBySections().map(
                                  (section, sectionIndex) => (
                                    <Accordion.Item
                                      key={section.id}
                                      eventKey={`section-${sectionIndex}`}
                                    >
                                      <Accordion.Header>
                                        <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                                          <span>{section.title}</span>
                                          <Badge
                                            bg="light"
                                            text="secondary"
                                            pill
                                          >
                                            {section.lessons.length} lessons
                                          </Badge>
                                        </div>
                                      </Accordion.Header>
                                      <Accordion.Body className="p-0">
                                        <ListGroup variant="flush">
                                          {section.lessons.map(
                                            (lesson, lessonIndex) => {
                                              const lessonNumber =
                                                sectionIndex * 10 +
                                                lessonIndex +
                                                1;
                                              const isPreviewableLesson =
                                                isPreviewable(
                                                  lessonNumber,
                                                  lesson
                                                );

                                              return (
                                                <ListGroup.Item
                                                  key={lesson.id || lessonIndex}
                                                  action
                                                  active={
                                                    activeLesson === lesson
                                                  }
                                                  disabled={
                                                    !isPreviewableLesson &&
                                                    !enrolled
                                                  }
                                                  onClick={() =>
                                                    handleLessonClick(lesson)
                                                  }
                                                  className="px-4 py-3 border-start-0 border-end-0"
                                                >
                                                  <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                      <div
                                                        className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-3"
                                                        style={{
                                                          width: "24px",
                                                          height: "24px",
                                                          fontSize: "12px",
                                                        }}
                                                      >
                                                        {lessonNumber}
                                                      </div>
                                                      <div>
                                                        <div
                                                          className="text-truncate"
                                                          style={{
                                                            maxWidth: "200px",
                                                          }}
                                                        >
                                                          {lesson.title}
                                                        </div>
                                                        <div className="d-flex align-items-center text-secondary small mt-1">
                                                          {getLessonIcon(
                                                            lesson.contentType
                                                          )}
                                                          <span className="ms-1">
                                                            {lesson.contentType}
                                                          </span>
                                                          <span className="mx-1">
                                                            •
                                                          </span>
                                                          <span>
                                                            {lesson.duration ||
                                                              "10 min"}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    {!isPreviewableLesson &&
                                                    !enrolled ? (
                                                      <Lock
                                                        size={16}
                                                        className="text-secondary"
                                                      />
                                                    ) : (
                                                      <PlayCircle
                                                        size={16}
                                                        className="text-primary"
                                                      />
                                                    )}
                                                  </div>
                                                </ListGroup.Item>
                                              );
                                            }
                                          )}
                                        </ListGroup>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  )
                                )}
                              </Accordion>
                            </div>
                          </Card>
                        </Col>

                        {/* Active lesson content - Right side */}
                        <Col lg={8}>
                          {activeLesson && (
                            <Card className="border shadow-sm h-100">
                              <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                                <div>
                                  <h3 className="fs-5 fw-semibold mb-0">
                                    {activeLesson.title}
                                  </h3>
                                  <div className="d-flex align-items-center text-secondary small mt-1">
                                    {getLessonIcon(activeLesson.contentType)}
                                    <span className="ms-1">
                                      {activeLesson.contentType}
                                    </span>
                                    <span className="mx-1">•</span>
                                    <span>
                                      {activeLesson.duration || "10 min"}
                                    </span>
                                  </div>
                                </div>
                                {activeLesson.resourceUrl && (
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="d-flex align-items-center"
                                  >
                                    <Download size={14} className="me-1" />
                                    Resources
                                  </Button>
                                )}
                              </Card.Header>

                              <Card.Body>
                                {enrolled || isPreviewable(0, activeLesson) ? (
                                  <>
                                    {activeLesson.contentType?.toLowerCase() ===
                                      "video" && activeLesson.videoUrl ? (
                                      <div className="ratio ratio-16x9 mb-4 bg-light rounded">
                                        <iframe
                                          src={activeLesson.videoUrl}
                                          title={activeLesson.title}
                                          allowFullScreen
                                          className="rounded"
                                        ></iframe>
                                      </div>
                                    ) : (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: activeLesson.content,
                                        }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <div className="text-center py-5">
                                    <div
                                      className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3"
                                      style={{ width: "64px", height: "64px" }}
                                    >
                                      <Lock
                                        size={28}
                                        className="text-secondary"
                                      />
                                    </div>
                                    <h3 className="fs-4 fw-semibold mb-2">
                                      This lesson is locked
                                    </h3>
                                    <p
                                      className="text-secondary mb-4 mx-auto"
                                      style={{ maxWidth: "400px" }}
                                    >
                                      Enroll in this course to access all
                                      lessons and materials
                                    </p>
                                    <Button
                                      variant="primary"
                                      onClick={handleEnroll}
                                      disabled={loading}
                                    >
                                      {loading ? "Processing..." : "Enroll Now"}
                                    </Button>
                                  </div>
                                )}
                              </Card.Body>

                              {/* Navigation */}
                              {(enrolled || isPreviewable(0, activeLesson)) && (
                                <Card.Footer className="bg-white border-top d-flex justify-content-between">
                                  <Button
                                    variant="outline-secondary"
                                    className="d-flex align-items-center"
                                    disabled={
                                      !activeLesson ||
                                      !courseContent[
                                        courseContent.indexOf(activeLesson) - 1
                                      ]
                                    }
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      className="me-1"
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                                      />
                                    </svg>
                                    Previous
                                  </Button>
                                  <Button
                                    variant="outline-primary"
                                    className="d-flex align-items-center"
                                    disabled={
                                      !activeLesson ||
                                      !courseContent[
                                        courseContent.indexOf(activeLesson) + 1
                                      ]
                                    }
                                  >
                                    Next
                                    <svg
                                      width="16"
                                      height="16"
                                      className="ms-1"
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                      />
                                    </svg>
                                  </Button>
                                </Card.Footer>
                              )}
                            </Card>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane
                    eventKey="resources"
                    active={activeTab === "resources"}
                  >
                    <div className="p-4">
                      <h2 className="fs-2 fw-bold mb-4">Course Resources</h2>
                      <Card className="border mb-4">
                        <ListGroup variant="flush">
                          {[
                            {
                              title: "Course Syllabus",
                              type: "PDF",
                              size: "1.2 MB",
                            },
                            {
                              title: "Exercise Files",
                              type: "ZIP",
                              size: "3.5 MB",
                            },
                            {
                              title: "Reference Guide",
                              type: "PDF",
                              size: "2.8 MB",
                            },
                            {
                              title: "Code Examples",
                              type: "ZIP",
                              size: "4.1 MB",
                            },
                          ].map((resource, index) => (
                            <ListGroup.Item
                              key={index}
                              action
                              className="px-4 py-3 d-flex justify-content-between align-items-center"
                            >
                              <div className="d-flex align-items-center">
                                <div
                                  className="d-flex align-items-center justify-content-center bg-light text-primary rounded me-3"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <FileType size={20} />
                                </div>
                                <div>
                                  <h4 className="fs-6 fw-semibold mb-0">
                                    {resource.title}
                                  </h4>
                                  <p className="text-secondary small mb-0">
                                    {resource.type} • {resource.size}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center"
                              >
                                <Download size={14} className="me-1" />
                                Download
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>

                      {/* Additional materials */}
                      <h3 className="fs-4 fw-semibold mb-3 mt-4">
                        Additional Materials
                      </h3>
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {[
                          {
                            title: "Recommended Reading",
                            icon: BookOpen,
                            description: "A curated list of books and articles",
                          },
                          {
                            title: "FAQ",
                            icon: HelpCircle,
                            description: "Answers to common questions",
                          },
                          {
                            title: "Community Discussion",
                            icon: Users,
                            description: "Join the conversation",
                          },
                        ].map((item, index) => {
                          const ItemIcon = item.icon;
                          return (
                            <Col key={index}>
                              <Card className="h-100 border hover-shadow">
                                <Card.Body className="p-4">
                                  <div
                                    className="d-flex align-items-center justify-content-center bg-light text-primary rounded-circle mb-3"
                                    style={{ width: "48px", height: "48px" }}
                                  >
                                    <ItemIcon size={24} />
                                  </div>
                                  <h4 className="fs-5 fw-semibold mb-2">
                                    {item.title}
                                  </h4>
                                  <p className="text-secondary mb-0">
                                    {item.description}
                                  </p>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        )}
      </Container>
    </div>
  );
}

// Missing Accordion component definition that should be imported from react-bootstrap
import { Accordion } from "react-bootstrap";

export default CourseView;
