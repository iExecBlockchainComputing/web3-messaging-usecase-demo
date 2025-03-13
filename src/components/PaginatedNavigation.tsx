import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination.tsx';
import { cn } from '../utils/style.utils.ts';

interface PaginatedNavigationProps {
  className: string;
  pages: unknown[][];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationItemLink = ({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <PaginationItem key={page}>
    <PaginationLink
      className="rounded-lg"
      isActive={isActive}
      onClick={onClick}
    >
      {page + 1}
    </PaginationLink>
  </PaginationItem>
);

const generatePaginationItems = (
  totalPages: number,
  currentPage: number,
  onPageChange: (page: number) => void
) => {
  const items: JSX.Element[] = [];

  if (currentPage <= 3) {
    for (let i = 0; i < Math.min(5, totalPages); i++) {
      items.push(
        <PaginationItemLink
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        />
      );
    }
    if (totalPages > 5) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
      items.push(
        <PaginationItemLink
          key={totalPages - 1}
          page={totalPages - 1}
          isActive={false}
          onClick={() => onPageChange(totalPages - 1)}
        />
      );
    }
  } else if (currentPage >= totalPages - 3) {
    if (totalPages >= 6) {
      items.push(
        <PaginationItemLink
          key={0}
          page={0}
          isActive={false}
          onClick={() => onPageChange(0)}
        />
      );
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    for (let i = totalPages - 5; i < totalPages; i++) {
      items.push(
        <PaginationItemLink
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        />
      );
    }
  } else {
    items.push(
      <PaginationItemLink
        key={0}
        page={0}
        isActive={false}
        onClick={() => onPageChange(0)}
      />
    );
    items.push(
      <PaginationItem key="ellipsis-start">
        <PaginationEllipsis />
      </PaginationItem>
    );
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 0 && i < totalPages) {
        items.push(
          <PaginationItemLink
            key={i}
            page={i}
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          />
        );
      }
    }
    items.push(
      <PaginationItem key="ellipsis-end">
        <PaginationEllipsis />
      </PaginationItem>
    );
    items.push(
      <PaginationItemLink
        key={totalPages - 1}
        page={totalPages - 1}
        isActive={false}
        onClick={() => onPageChange(totalPages - 1)}
      />
    );
  }

  return items;
};

export function PaginatedNavigation({
  className,
  pages,
  currentPage,
  onPageChange,
}: PaginatedNavigationProps) {
  const totalPages = pages.length;

  return (
    <Pagination className={cn(className, 'py-4')}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="rounded-lg"
            disabled={currentPage <= 0}
            onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        {generatePaginationItems(totalPages, currentPage, onPageChange)}
        <PaginationItem>
          <PaginationNext
            className="rounded-lg"
            disabled={currentPage >= totalPages - 1}
            onClick={() =>
              currentPage < totalPages - 1 && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
