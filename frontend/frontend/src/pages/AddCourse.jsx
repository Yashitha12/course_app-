import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { createCourse } from "../api";

function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    image: null,
    duration: "",
    language: "",
    level: "",
    tags: [],
  });

  // For tag input
  const [tagInput, setTagInput] = useState("");

  // Handle input changes for course data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setCourseData({
      ...courseData,
      image: e.target.files[0],
    });
  };

  // Handle tag input
  const addTag = () => {
    if (tagInput.trim() && !courseData.tags.includes(tagInput.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Duration options
  const durationOptions = [
    "Select Duration",
    "1-3 hours",
    "3-6 hours",
    "6-10 hours",
    "10-15 hours",
    "15-20 hours",
    "Self-paced",
    "1 week",
    "2 weeks",
    "4 weeks",
    "6 weeks",
    "8 weeks",
    "10 weeks",
    "12 weeks",
  ];

  // Language options
  const languageOptions = [
    "Select Language",
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Russian",
    "Portuguese",
    "Hindi",
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("duration", courseData.duration);
      formData.append("language", courseData.language);
      formData.append("level", courseData.level);
      formData.append("tags", JSON.stringify(courseData.tags));

      if (courseData.image) {
        formData.append("image", courseData.image);
      }

      // Call API to create course
      await createCourse(formData);

      // Navigate to instructor dashboard on success
      navigate("/instructor");
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Professional color scheme
  const colors = {
    mediumBlue: "#0000cd",
    darkBlue: "#00008b",
    royalBlue: "#4169e1",
    dodgerBlue: "#1e90ff",
  };

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold" style={{ color: colors.darkBlue }}>
          Create New Course
        </h1>
        <p className="lead" style={{ color: colors.mediumBlue }}>
          Fill in the details below to create your course
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Course Information */}
      <Card className="shadow-sm border-0 mb-5">
        <Card.Header
          className="bg-white border-bottom-0 pt-4 pb-0 px-4"
          style={{ borderLeft: `5px solid ${colors.royalBlue}` }}
        >
          <h2 style={{ color: colors.darkBlue }}>Course Information</h2>
          <p className="text-muted">Enter the details of your course</p>
        </Card.Header>

        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                {/* Course Title */}
                <Form.Group className="mb-4" controlId="courseTitle">
                  <Form.Label className="fw-bold">Course Title*</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title"
                    required
                    className="shadow-sm"
                  />
                </Form.Group>

                {/* Course Duration */}
                <Form.Group className="mb-4" controlId="courseDuration">
                  <Form.Label className="fw-bold">Course Duration*</Form.Label>
                  <Form.Select
                    name="duration"
                    value={courseData.duration}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  >
                    {durationOptions.map((option) => (
                      <option
                        key={option}
                        value={option === "Select Duration" ? "" : option}
                      >
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Course Language */}
                <Form.Group className="mb-4" controlId="courseLanguage">
                  <Form.Label className="fw-bold">Language*</Form.Label>
                  <Form.Select
                    name="language"
                    value={courseData.language}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  >
                    {languageOptions.map((option) => (
                      <option
                        key={option}
                        value={option === "Select Language" ? "" : option}
                      >
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Course Level */}
                <Form.Group className="mb-4" controlId="courseLevel">
                  <Form.Label className="fw-bold">Skill Level*</Form.Label>
                  <Form.Select
                    name="level"
                    value={courseData.level}
                    onChange={handleChange}
                    required
                    className="shadow-sm"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                {/* Course Description */}
                <Form.Group className="mb-4" controlId="courseDescription">
                  <Form.Label className="fw-bold">
                    Course Description*
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={courseData.description}
                    onChange={handleChange}
                    placeholder="Describe what students will learn"
                    required
                    className="shadow-sm"
                    rows={5}
                  />
                </Form.Group>

                {/* Course Image */}
                <Form.Group className="mb-4" controlId="courseImage">
                  <Form.Label className="fw-bold">Course Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="shadow-sm"
                  />
                  <Form.Text className="text-muted">
                    Recommended size: 1280×720 pixels (16:9 ratio)
                  </Form.Text>

                  {courseData.image && (
                    <div className="mt-2 border rounded p-2">
                      <div className="small text-muted">Selected file:</div>
                      <div className="fw-medium">{courseData.image.name}</div>
                    </div>
                  )}
                </Form.Group>

                {/* Tags Input */}
                <Form.Group className="mb-4" controlId="courseTags">
                  <Form.Label className="fw-bold">Tags</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags (e.g., Python, Web Dev)"
                      className="shadow-sm me-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      variant="outline-primary"
                      onClick={addTag}
                      style={{
                        borderColor: colors.royalBlue,
                        color: colors.royalBlue,
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Display tags */}
                  <div className="mt-2">
                    {courseData.tags.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {courseData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            bg="info"
                            className="px-3 py-2 d-flex align-items-center"
                            style={{
                              backgroundColor: colors.royalBlue,
                            }}
                          >
                            {tag}
                            <span
                              role="button"
                              onClick={() => removeTag(tag)}
                              className="ms-2 fw-bold"
                            >
                              &times;
                            </span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="small text-muted">No tags added yet</div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4 border-top pt-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/instructor")}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                style={{
                  backgroundColor: colors.royalBlue,
                  borderColor: colors.royalBlue,
                }}
              >
                {loading ? "Publishing..." : "Publish Course"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddCourse;
