import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LibraryBook, BookIssue, TransportBus, LibraryCategory } from '../../types';
import {
  BookOpen,
  Bus,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Calendar,
  X,
  Navigation
} from 'lucide-react';

interface LibraryAndTransportProps {
  onClose?: () => void;
  defaultTab?: 'library' | 'transport';
}

export const LibraryAndTransport: React.FC<LibraryAndTransportProps> = ({
  onClose,
  defaultTab = 'library',
}) => {
  const {
    currentUser,
    users,
    libraryBooks,
    bookIssues,
    buses,
    issueBook,
    returnBook,
    addBook,
    updateBusStatus,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'library' | 'issues' | 'transport' | 'add_book'>(
    defaultTab === 'transport' ? 'transport' : 'library'
  );

  // Search & Filter States
  const [bookSearch, setBookSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBusRoute, setSelectedBusRoute] = useState<string>('all');

  // Issue Book Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookToIssue, setSelectedBookToIssue] = useState<LibraryBook | null>(null);
  const [issueStudentId, setIssueStudentId] = useState('');

  // Add Book Form
  const [newBookData, setNewBookData] = useState<{
    title: string;
    author: string;
    isbn: string;
    category: LibraryCategory;
    totalCopies: number;
    rackLocation: string;
  }>({
    title: '',
    author: '',
    isbn: 'ISBN-978-019-',
    category: 'Physics',
    totalCopies: 5,
    rackLocation: 'Rack A-3',
  });

  const students = users.filter((u) => u.role === 'student');

  // Filtered Books
  const filteredBooks = libraryBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.isbn.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.rackLocation.toLowerCase().includes(bookSearch.toLowerCase());

    const matchesCat = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenIssueModal = (book: LibraryBook) => {
    setSelectedBookToIssue(book);
    setIssueStudentId(students[0]?.id || '');
    setIsIssueModalOpen(true);
  };

  const handleConfirmIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookToIssue || !issueStudentId) return;

    issueBook(selectedBookToIssue.id, issueStudentId, 14);
    setIsIssueModalOpen(false);
    alert(`Book "${selectedBookToIssue.title}" issued successfully for 14 days!`);
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookData.title.trim()) return;

    addBook({
      title: newBookData.title,
      author: newBookData.author,
      isbn: newBookData.isbn,
      category: newBookData.category,
      totalCopies: Number(newBookData.totalCopies),
      rackLocation: newBookData.rackLocation,
    });

    alert('New Library Book added to catalog!');
    setActiveTab('library');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto my-4 text-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/30 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-md border border-teal-400/30">
                Resource & Logistics Center
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Live Fleet & Catalog
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              Library & School Bus Transport Tracker
            </h2>
            <p className="text-xs text-slate-300">
              Manage library book lending, overdue fines, and real-time campus bus route tracking.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'library'
              ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>Library Book Catalog ({libraryBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'issues'
              ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Borrowed Books & Fines ({bookIssues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'transport'
              ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bus className="w-4 h-4 text-blue-600" />
          <span>School Bus Fleet Tracking ({buses.length} Routes)</span>
        </button>

        {currentUser?.role !== 'student' && (
          <button
            onClick={() => setActiveTab('add_book')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'add_book'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Catalog Book</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: LIBRARY BOOK CATALOG */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN, or rack location..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="all">All Categories</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Literature">Literature</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="ICT">ICT & Computing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100">
                        {book.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {book.rackLocation}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 font-serif line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-slate-500">Author: <strong>{book.author}</strong></p>
                    <div className="text-[10px] font-mono text-slate-400">{book.isbn}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Available</span>
                      <strong className={`text-xs ${book.availableCopies > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {book.availableCopies} / {book.totalCopies} Copies
                      </strong>
                    </div>

                    {currentUser?.role !== 'student' && book.availableCopies > 0 && (
                      <button
                        onClick={() => handleOpenIssueModal(book)}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <span>Issue Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BORROWED ISSUES & OVERDUE FINES */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Issue ID</th>
                    <th className="p-3.5">Book Title</th>
                    <th className="p-3.5">Student / Roll</th>
                    <th className="p-3.5">Issue Date</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-teal-700">{issue.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{issue.bookTitle}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{issue.studentName}</span>
                        <span className="text-[10px] text-slate-400">Roll: {issue.rollNo}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{issue.issueDate}</td>
                      <td className="p-3.5 text-slate-600">{issue.dueDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          issue.status === 'returned'
                            ? 'bg-emerald-100 text-emerald-800'
                            : issue.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {issue.status !== 'returned' && currentUser?.role !== 'student' && (
                          <button
                            onClick={() => {
                              returnBook(issue.id);
                              alert(`Book "${issue.bookTitle}" marked as returned to library rack!`);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Mark Returned
                          </button>
                        )}
                        {issue.status === 'returned' && (
                          <span className="text-emerald-700 font-bold text-xs flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSPORT BUS FLEET TRACKING */}
        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Real-Time School Bus Fleet</h3>
                <p className="text-xs text-slate-500">Live GPS route tracking, stoppage timings, and driver emergency dispatch</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                All 3 Buses Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-blue-900 font-serif">{bus.busNumber}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">{bus.plateNumber}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      bus.status === 'on_route'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : bus.status === 'arrived_campus'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bus.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Current Location:</span>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{bus.currentLocation}</span>
                    </div>
                  </div>

                  {/* Stoppages Timeline */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Route Stoppages</span>
                    <div className="space-y-1">
                      {bus.stoppages.map((stop, idx) => (
                        <div key={`${bus.id}-${stop.stopName}-${idx}`} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>
                            {stop.stopName} • {stop.pickupTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Driver & Contact */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Driver:</span>
                      <strong className="text-slate-800">{bus.driverName}</strong>
                    </div>
                    <a
                      href={`tel:${bus.driverPhone}`}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3" /> Call Driver
                    </a>
                  </div>

                  {/* Transport Admin Controls */}
                  {currentUser?.role !== 'student' && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => updateBusStatus(bus.id, 'on_route', 'Airport Road crossing')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                      >
                        Set On Route
                      </button>
                      <button
                        onClick={() => updateBusStatus(bus.id, 'arrived_campus', 'Main School Parking')}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold"
                      >
                        Set Arrived
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADD NEW BOOK (LIBRARIAN/ADMIN) */}
        {activeTab === 'add_book' && (
          <form onSubmit={handleAddBookSubmit} className="max-w-xl mx-auto bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Add New Book to Central Library</h3>
              <p className="text-xs text-slate-500">Enter ISBN and physical rack location for student borrowing</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Book Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Higher Secondary Biology Vol 1"
                value={newBookData.title}
                onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Author Name</label>
                <input
                  type="text"
                  required
                  placeholder="Author"
                  value={newBookData.author}
                  onChange={(e) => setNewBookData({ ...newBookData, author: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newBookData.category}
                  onChange={(e) =>
                    setNewBookData({
                      ...newBookData,
                      category: e.target.value as LibraryCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Literature">Literature</option>
                  <option value="ICT">ICT & Computing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rack Location</label>
                <input
                  type="text"
                  placeholder="e.g. Rack C-4"
                  value={newBookData.rackLocation}
                  onChange={(e) => setNewBookData({ ...newBookData, rackLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Copies</label>
                <input
                  type="number"
                  min={1}
                  value={newBookData.totalCopies}
                  onChange={(e) => setNewBookData({ ...newBookData, totalCopies: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Book into Library Registry
            </button>
          </form>
        )}
      </div>

      {/* ISSUE BOOK MODAL */}
      {isIssueModalOpen && selectedBookToIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif">Issue Book to Student</h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-900 space-y-1">
              <strong className="block text-sm font-serif">{selectedBookToIssue.title}</strong>
              <p>Author: {selectedBookToIssue.author} • Location: {selectedBookToIssue.rackLocation}</p>
            </div>

            <form onSubmit={handleConfirmIssue} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Student</label>
                <select
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll: {s.rollNo} • {s.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 border border-amber-200 text-[11px]">
                ⏱️ Standard return duration: <strong>14 Days</strong>. Automated reminder will be dispatched to the student's notification center.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-md"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
