import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
      <span className="text-sm font-normal text-textSecondary mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Showing <span className="font-semibold text-textPrimary">{currentPage * 10 - 9}-{Math.min(currentPage * 10, totalPages)}</span> of <span className="font-semibold text-textPrimary">{totalPages}</span>
      </span>
      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-textSecondary bg-white border border-neutral-300 rounded-s-lg hover:bg-neutral-100 hover:text-textPrimary"
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`flex items-center justify-center px-3 h-8 leading-tight text-textSecondary bg-white border border-neutral-300 ${currentPage === number ? 'border-neutral-100 text-textPrimary' : 'hover:border-neutral-100 hover:text-textPrimary'}`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-3 h-8 leading-tight text-textSecondary bg-white border border-neutral-300 rounded-e-lg hover:border-neutral-100 hover:text-textPrimary"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination