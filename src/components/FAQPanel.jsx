"use client"

import { useState, useEffect } from "react"
import { X, Send, ChevronDown, ChevronUp, Trash2, MessageCircle, Edit2, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FAQPanel = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const [faqs, setFaqs] = useState([])
  const [newQuestion, setNewQuestion] = useState("")
  const [replyText, setReplyText] = useState({})
  const [expandedFAQ, setExpandedFAQ] = useState({})
  const [loading, setLoading] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editingAnswer, setEditingAnswer] = useState(null)
  const [editText, setEditText] = useState("")

  const handleEditQuestion = async (faqId) => {
    if (!editText.trim()) {
      toast.error("La pregunta no puede estar vacía")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/faq/${faqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: editText }),
      })

      if (!res.ok) throw new Error("Error al editar pregunta")

      const updatedFAQ = await res.json()
      setFaqs(faqs.map((f) => (f._id === faqId ? updatedFAQ : f)))
      setEditingQuestion(null)
      setEditText("")
      toast.success("Pregunta actualizada")
    } catch (error) {
      toast.error("Error al actualizar la pregunta")
    }
  }

  const handleEditAnswer = async (faqId, answerId) => {
    if (!editText.trim()) {
      toast.error("La respuesta no puede estar vacía")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/faq/${faqId}/answers/${answerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      })

      if (!res.ok) throw new Error("Error al editar respuesta")

      const updatedFAQ = await res.json()
      setFaqs(faqs.map((f) => (f._id === faqId ? updatedFAQ : f)))
      setEditingAnswer(null)
      setEditText("")
      toast.success("Respuesta actualizada")
    } catch (error) {
      toast.error("Error al actualizar la respuesta")
    }
  }

  const startEditingQuestion = (faqId, currentText) => {
    setEditingQuestion(faqId)
    setEditText(currentText)
  }

  const startEditingAnswer = (answerId, currentText) => {
    setEditingAnswer(answerId)
    setEditText(currentText)
  }

  const cancelEditing = () => {
    setEditingQuestion(null)
    setEditingAnswer(null)
    setEditText("")
  }

  const getInitials = (name) => {
    if (!name) return "?"
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  useEffect(() => {
    if (isOpen) {
      fetchFAQs()
    }
  }, [isOpen])

  const fetchFAQs = async () => {
    try {
      const res = await fetch(`${API_URL}/faq`)
      const data = await res.json()
      setFaqs(data)
    } catch (error) {
      console.error("Error al cargar preguntas:", error)
      toast.error("Error al cargar las preguntas")
    }
  }

  const handleSubmitQuestion = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error("Debes iniciar sesión para hacer una pregunta", {
        style: {
          background: "rgba(239, 68, 68, 0.1)",
          border: "2px solid rgb(239, 68, 68)",
          borderRadius: "12px",
          color: "rgb(239, 68, 68)",
          backdropFilter: "blur(10px)",
        },
      })
      return
    }

    if (!newQuestion.trim()) {
      toast.error("La pregunta no puede estar vacía")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: newQuestion }),
      })

      if (!res.ok) throw new Error("Error al crear pregunta")

      const data = await res.json()
      setFaqs([data, ...faqs])
      setNewQuestion("")
      toast.success("Pregunta publicada")
    } catch (error) {
      toast.error("Error al publicar la pregunta")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (faqId) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para responder", {
        style: {
          background: "rgba(239, 68, 68, 0.1)",
          border: "2px solid rgb(239, 68, 68)",
          borderRadius: "12px",
          color: "rgb(239, 68, 68)",
          backdropFilter: "blur(10px)",
        },
      })
      return
    }

    const text = replyText[faqId]
    if (!text?.trim()) {
      toast.error("La respuesta no puede estar vacía")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/faq/${faqId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) throw new Error("Error al responder")

      const updatedFAQ = await res.json()
      setFaqs(faqs.map((f) => (f._id === faqId ? updatedFAQ : f)))
      setReplyText({ ...replyText, [faqId]: "" })
      toast.success("Respuesta publicada")
    } catch (error) {
      toast.error("Error al publicar la respuesta")
    }
  }

  const confirmDelete = (onConfirm, message = "¿Estás seguro?") => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-white">{message}</p>
          <p className="text-sm text-gray-400">Esta acción no se puede deshacer</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onConfirm()
                toast.dismiss(t.id)
              }}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: Number.POSITIVE_INFINITY,
        style: {
          background: "#1a1f35",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          maxWidth: "400px",
        },
      },
    )
  }

  const handleDeleteQuestion = async (faqId) => {
    confirmDelete(async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_URL}/faq/${faqId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Error al eliminar")

        setFaqs(faqs.filter((f) => f._id !== faqId))
        toast.success("Pregunta eliminada correctamente")
      } catch (error) {
        toast.error("Error al eliminar la pregunta")
      }
    }, "¿Eliminar esta pregunta?")
  }

  const handleDeleteAnswer = async (faqId, answerId) => {
    confirmDelete(async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_URL}/faq/${faqId}/answers/${answerId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Error al eliminar")

        const updatedFAQ = await res.json()
        setFaqs(faqs.map((f) => (f._id === faqId ? updatedFAQ : f)))
        toast.success("Respuesta eliminada correctamente")
      } catch (error) {
        toast.error("Error al eliminar la respuesta")
      }
    }, "¿Eliminar esta respuesta?")
  }

  const toggleExpand = (faqId) => {
    setExpandedFAQ({ ...expandedFAQ, [faqId]: !expandedFAQ[faqId] })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-yamaha-dark-900/95 backdrop-blur-xl border-l-2 border-yamaha-blue-900/30 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-yamaha-blue-900/30 bg-yamaha-dark-800/50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <MessageCircle className="w-7 h-7 text-yamaha-accent" />
                  Preguntas Frecuentes
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-yamaha-dark-700/50 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-400">Haz preguntas y obtén respuestas de la comunidad</p>
            </div>

            {/* Formulario nueva pregunta */}
            {currentUser && (
              <div className="p-6 border-b border-yamaha-blue-900/30 bg-yamaha-dark-800/30">
                <form onSubmit={handleSubmitQuestion} className="space-y-3">
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="¿Cuál es tu pregunta?"
                    className="w-full px-4 py-3 bg-yamaha-dark-700/50 border-2 border-yamaha-blue-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yamaha-accent resize-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    disabled={loading || !newQuestion.trim()}
                    className="w-full bg-gradient-accent text-black px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yamaha-accent-light transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Publicar Pregunta
                  </button>
                </form>
              </div>
            )}

            {/* Lista de preguntas */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {faqs.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">No hay preguntas aún</p>
                  <p className="text-sm text-gray-600 mt-2">¡Sé el primero en hacer una pregunta!</p>
                </div>
              ) : (
                faqs.map((faq) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yamaha-dark-800/50 backdrop-blur-sm border border-yamaha-blue-900/30 rounded-xl p-4"
                  >
                    {/* Usuario y pregunta */}
                    <div className="flex items-start gap-3 mb-3">
                      {faq.user.photoURL ? (
                        <img
                          src={faq.user.photoURL || "/placeholder.svg"}
                          alt={faq.user.name}
                          className="w-10 h-10 rounded-full border-2 border-yamaha-accent/50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-black font-bold text-sm">
                          {getInitials(faq.user.name)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{faq.user.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              faq.user.role === "admin"
                                ? "bg-yamaha-accent/20 text-yamaha-accent"
                                : "bg-yamaha-blue-500/20 text-yamaha-blue-300"
                            }`}
                          >
                            {faq.user.role === "admin" ? "Admin" : "Usuario"}
                          </span>
                        </div>
                        {editingQuestion === faq._id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-3 py-2 bg-yamaha-dark-700/50 border-2 border-yamaha-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yamaha-accent resize-none"
                              rows="3"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditQuestion(faq._id)}
                                className="px-3 py-1.5 bg-yamaha-accent text-black rounded-lg font-semibold text-sm hover:bg-yamaha-accent-light transition-colors flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Guardar
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-3 py-1.5 bg-gray-700 text-white rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300">{faq.question}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(faq.createdAt).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {currentUser &&
                        (currentUser.id === faq.user.id || currentUser.role === "admin") &&
                        editingQuestion !== faq._id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditingQuestion(faq._id, faq.question)}
                              className="p-2 text-gray-500 hover:text-yamaha-accent transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(faq._id)}
                              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => toggleExpand(faq._id)}
                        className="text-xs text-yamaha-accent hover:text-yamaha-accent-light flex items-center gap-1"
                      >
                        {expandedFAQ[faq._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {faq.answers.length} {faq.answers.length === 1 ? "Respuesta" : "Respuestas"}
                      </button>
                    </div>

                    {/* Respuestas */}
                    <AnimatePresence>
                      {expandedFAQ[faq._id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 mt-3 pl-4 border-l-2 border-yamaha-blue-900/30"
                        >
                          {faq.answers.map((answer) => (
                            <div key={answer._id} className="flex items-start gap-2">
                              {answer.user.photoURL ? (
                                <img
                                  src={answer.user.photoURL || "/placeholder.svg"}
                                  alt={answer.user.name}
                                  className="w-8 h-8 rounded-full border border-yamaha-accent/30"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-yamaha-blue-500/20 flex items-center justify-center text-xs font-bold text-yamaha-blue-300">
                                  {getInitials(answer.user.name)}
                                </div>
                              )}
                              <div className="flex-1 bg-yamaha-dark-700/30 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">{answer.user.name}</span>
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        answer.user.role === "admin"
                                          ? "bg-yamaha-accent/20 text-yamaha-accent"
                                          : "bg-yamaha-blue-500/20 text-yamaha-blue-300"
                                      }`}
                                    >
                                      {answer.user.role === "admin" ? "Admin" : "Usuario"}
                                    </span>
                                  </div>
                                  {currentUser &&
                                    (currentUser.id === answer.user.id || currentUser.role === "admin") &&
                                    editingAnswer !== answer._id && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => startEditingAnswer(answer._id, answer.text)}
                                          className="p-1 text-gray-500 hover:text-yamaha-accent transition-colors"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteAnswer(faq._id, answer._id)}
                                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                </div>
                                {editingAnswer === answer._id ? (
                                  <div className="space-y-2 mt-2">
                                    <textarea
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      className="w-full px-3 py-2 bg-yamaha-dark-700/50 border-2 border-yamaha-accent rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yamaha-accent resize-none"
                                      rows="2"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleEditAnswer(faq._id, answer._id)}
                                        className="px-3 py-1 bg-yamaha-accent text-black rounded-lg font-semibold text-xs hover:bg-yamaha-accent-light transition-colors flex items-center gap-1"
                                      >
                                        <Check className="w-3 h-3" />
                                        Guardar
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="px-3 py-1 bg-gray-700 text-white rounded-lg font-semibold text-xs hover:bg-gray-600 transition-colors"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm text-gray-300">{answer.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(answer.createdAt).toLocaleDateString("es-AR", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}

                          {currentUser && (
                            <div className="flex gap-2 mt-3">
                              <input
                                type="text"
                                value={replyText[faq._id] || ""}
                                onChange={(e) => setReplyText({ ...replyText, [faq._id]: e.target.value })}
                                placeholder="Escribe una respuesta..."
                                className="flex-1 px-3 py-2 bg-yamaha-dark-700/50 border border-yamaha-blue-900/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yamaha-accent"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleSubmitReply(faq._id)
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleSubmitReply(faq._id)}
                                disabled={!replyText[faq._id]?.trim()}
                                className="px-4 py-2 bg-yamaha-accent text-black rounded-lg font-semibold text-sm hover:bg-yamaha-accent-light transition-colors disabled:opacity-50"
                              >
                                Responder
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FAQPanel
